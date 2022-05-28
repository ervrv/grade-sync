const logger = require('../../lib/logger');

const config = require('../../conf');
const Request = require('tedious').Request;
const Connection = require('tedious').Connection;
const TYPES = require('tedious').TYPES;
const router = require('express')
	.Router();
const moment = require('moment');
const Grade = require('../../model/grade');
const AttendanceLogs = require('../../model/attendance_logs');
const SyncLog = require('../../model/sync-log');
const dateFormat = require('dateformat');

const conf = require('../../conf');

const currentYear = conf.grade.year;
const currentSemester = conf.grade.semester;
const minDaylySecs = conf.scud.minDaylySecs;


function loadAttendanceFromRange(conn, start, finish) {
	const sql = 'SELECT * FROM VisitsForSportDaily vfsd WHERE vfsd.Edate >= @start and vfsd.Edate < @finish ORDER BY vfsd.StudentId ASC ';
	let rowsToProcess = [];
	const semester = currentSemester;
	const year = currentYear;
	let lastRecord = null;
	const request = new Request(sql, (err, rowCount) => {
		if (err) {
			throw err;
		}
	});

	request.addParameter('start', TYPES.Date, start);
	request.addParameter('finish', TYPES.Date, finish);

	const processRows = function (allRows) {
		if (allRows.length === 0) {
			request.resume();
		} else {
			const nextRow = allRows.shift();
			Grade.putGymAttendanceSync(nextRow, year, semester, (res) => {
				if (res !== '') {
					AttendanceLogs.write(res[0].error, nextRow.dates[0], nextRow.externalID);
				}
				processRows(allRows);
			});
		}
	};

	request.on('row', (columns) => {
		let recordBook = '';
		let eDate = null;
		let date = null;
		let externalID = null;

		let isLongEnough = false;
		columns.forEach((column) => {
			if (column.value === null) {
				// console.log('NULL');
			} else {
				switch (column.metadata.colName) {
					case 'StudentId': {
						externalID = column.value.toString()
							.padStart(9, '0');
						break;
					}
					case 'Edate': {
						eDate = column.value;
						date = dateFormat(column.value, 'yyyy-mm-dd');
						break;
					}
					case 'secs': {
						isLongEnough = column.value >= minDaylySecs;
						break;
					}
					default: {
						break;
					}
				}
			}
		});
		if (isLongEnough) {
			if (lastRecord === null) {
				lastRecord = {
					recordBook: recordBook,
					externalID: externalID,
					dates: [
						date,
					],
				};
			} else {
				if (lastRecord.externalID !== externalID) {
					if (rowsToProcess.length >= 100) {
						request.pause();
						processRows(rowsToProcess);
					}
					lastRecord = {
						recordBook: recordBook,
						externalID: externalID,
						dates: [
							date,
						],
					};
					rowsToProcess.push(lastRecord);
				} else {
					lastRecord.dates.push(date);
				}
			}
		}
	});

	request.on('done', (rowCount, more) => {
		processRows(rowsToProcess);
	});

	request.on('doneInProc', (rowCount, more) => {
		if (lastRecord !== null) {
			rowsToProcess.push(lastRecord);
		}
		processRows(rowsToProcess);
	});


	conn.execSql(request);
}

async function loadAttendanceFromDate(conn, date, sqlRequest = '') {
	if (sqlRequest === '') {
		sqlRequest = `SELECT * FROM VisitsForSportDaily vfsd WHERE vfsd.Edate = '${date}'`
	}
	const request = new Request(sqlRequest, async (err, rowCount, rows) => {
		if (err) {
			throw err;
		}
		for (let i = 0; i < rowCount; i++) {
			let row = rows[i];
			let recordBook = '';
			let eDate = null;
			let date = null;
			let externalID = null;
			const semester = currentSemester;
			const year = currentYear;
			let isLongEnough = false;
			row.forEach((column) => {
				if (column.value === null) {
					//console.log('NULL');
				} else {
					switch (column.metadata.colName) {
						case 'StudentId': {
							externalID = column.value.toString()
								.padStart(9, '0');
							break;
						}
						case 'Edate': {
							eDate = column.value;
							date = dateFormat(column.value, 'yyyy-mm-dd');
							break;
						}
						case 'secs': {
							isLongEnough = column.value >= minDaylySecs;
							break;
						}
						default: {
							break;
						}
					}
				}
			});
			if (isLongEnough) {
				const answer = await Grade.putGymAttendance(recordBook, date, externalID, semester, year);
				if (answer !== '') {
					await AttendanceLogs.write(answer[0].error, eDate, externalID);
				}
			}
		}
		console.log('DONE!');
		conn.close();
	});
	// Emits a 'DoneInProc' event when completed.
	// request.on('done', async (rowCount, more, rows) => {
	// 	console.log(rowCount);
	// });
	// request.on('doneProc', async (rowCount, more, status, rows) => {
	// 	console.log(rowCount);
	// });

	// In SQL Server 2000 you may need: connection.execSqlBatch(request);
	conn.execSql(request);
}

async function loadAttendanceForDateEmail(conn, date, email) {
	loadAttendanceFromDate(conn, date, `SELECT * FROM VisitsForSportDaily vfsd WHERE vfsd.Edate = '${date}' AND vfsd.email = '${email}'`);
}

async function loadAttendanceForEmail(conn, email) {
	loadAttendanceFromDate(conn, '', `SELECT * FROM VisitsForSportDaily vfsd WHERE vfsd.email = '${email}'`);
}

async function loadYesterdaysAttendance(conn) {
	loadAttendanceFromRange(
		conn,
		moment()
			.subtract(7, 'days')
			.format('YYYY-MM-DD'),
		moment()
			.format('YYYY-MM-DD'),
	);
}

router.get('/', async (req, res, next) => {
	try {
		let logs = [];

		logger.info({
			content: {
				timestamp: new Date(),
				type: 'attendance',
			}
		}, 'START', 'Sync gym attendance');

		const connection = new Connection(config.scud);
		connection.on('connect', async (err) => {
			if (err) {
				console.log('Connection Failed');
				throw err;
			}
			await loadYesterdaysAttendance(connection);
		});
		connection.connect();

		logger.info({
			content: {
				timestamp: new Date(),
				type: 'attendance',
			}
		}, 'DONE', 'Sync gym attendance');

		res.json(logs);
	} catch (err) {
		next(err);
	}
});

router.get('/date', async (req, res, next) => {
	try {
		let logs = [];
		const day = req.query.date;

		logger.info({
			content: {
				timestamp: new Date(),
				type: 'attendance',
			}
		}, 'START', 'Sync gym attendance');

		const connection = new Connection(config.scud);
		connection.on('connect', async (err) => {
			if (err) {
				console.log('Connection Failed');
				throw err;
			}
			await loadAttendanceFromDate(connection, day);
		});
		connection.connect();

		logger.info({
			content: {
				timestamp: new Date(),
				type: 'attendance',
			}
		}, 'DONE', 'Sync gym attendance');

		res.json(logs);
	} catch (err) {
		next(err);
	}
});

router.get('/email', async (req, res, next) => {
	try {
		let logs = [];
		const email = req.query.email;

		logger.info({
			content: {
				timestamp: new Date(),
				type: 'attendance',
			}
		}, 'START', 'Sync gym attendance');

		const connection = new Connection(config.scud);
		connection.on('connect', async (err) => {
			if (err) {
				console.log('Connection Failed');
				throw err;
			}
			await loadAttendanceForEmail(connection, email);
		});
		connection.connect();

		logger.info({
			content: {
				timestamp: new Date(),
				type: 'attendance',
			}
		}, 'DONE', 'Sync gym attendance');

		res.json(logs);
	} catch (err) {
		next(err);
	}
});

router.get('/range', (req, res, next) => {
	try {
		let logs = [];
		const start = req.query.startDate;
		const finish = req.query.finishDate;

		logger.info({
			content: {
				timestamp: new Date(),
				type: 'attendance',
			}
		}, 'START', 'Sync gym attendance for date range');

		const connection = new Connection(config.scud);
		connection.on('connect', (err) => {
			if (err) {
				console.log('Connection Failed');
				throw err;
			}
			loadAttendanceFromRange(connection, start, finish);
		});
		connection.connect();

		logger.info({
			content: {
				timestamp: new Date(),
				type: 'attendance',
			}
		}, 'DONE', 'Sync gym attendance for date range');

		res.json(logs);
	} catch (err) {
		next(err);
	}
});


module.exports = router;
