const logger = require('../../lib/logger');

const Sync = require('../../model/sync');
const SyncLog = require('../../model/sync-log');
const Office = require('../../model/office');
const Grade = require('../../model/grade');
const Dump = require('../../model/dump');
const SyncData = require('../../model/sync-data');
const Unpack = require('../../utils/unpack');
const GlobalDisciplines = require('../../model/global_discipline');

const facultyNameById = require('../../model/faculty-name').facultyName;

const router = require('express')
	.Router();

const conf = require('../../conf');

router.get('/', async (req, res, next) => {
	const { year, semester } = req.query;

	try {
		logger.info({content: {
			//faculty: faculty.externalID,
			timestamp: new Date(),
			type: 'language',
		}}, 'START', 'Sync language disciplines');

		var officeGlobalDiscUrl = conf.office.url;

		Office.getGlobalDisciplines(officeGlobalDiscUrl, year, semester, function(result) {
			// SyncLog.write('globalDisciplines', faculty.id, 'office response', plans);
			let i=0,j=0;
			let batchSize = 40;
			let executor = null;
			let nextBatch = [];
			for (i,j=result.groups.length; i<j; i+=batchSize) {
				nextBatch = result.groups.slice(i,i+batchSize);
				if (executor === null)
				{
					executor = Grade.putGlobalDisciplines(year.substr(0, 4), semester, nextBatch);
				} else {
					let f = function(batch) {
						return function (result) {
							let gradeResponse = result;
							return Grade.putGlobalDisciplines(year.substr(0, 4), semester, batch);
						};
					};
					executor = executor.then(f(nextBatch));
				}
			}
			executor.then(function(result) {
				// SyncLog.write('globalDisciplines', faculty.id, 'grade response', gradeResponse);
				logger.info({content: {
					// faculty: faculty.externalID,
					timestamp: new Date(),
					type: 'language',
				}}, 'DONE', 'Sync language disciplines');
				res.api.response();
			});

		}, function(error) {
			console.log(error);
			res.api.response();
		});

	} catch (err) {
		//await SyncLog.write('globalDisciplines', faculty.id, 'error', err);
		logger.error(err);
		res.api.response();
	}
//	res.api.response();
});

router.get('/muam', async (req, res, next) => {
	const { year, semester } = req.query;

	try {
		logger.info({content: {
			//faculty: faculty.externalID,
			timestamp: new Date(),
			type: 'muam',
		}}, 'START', 'Sync muam disciplines');

		var officeGlobalDiscUrl = conf.office.muam_url;

		Office.getGlobalDisciplines(officeGlobalDiscUrl, year, semester, function(result) {
			// SyncLog.write('globalDisciplines', faculty.id, 'office response', plans);
			let i=0,j=0;
			let batchSize = 40;
			let executor = null;
			let nextBatch = [];
			for (i,j=result.groups.length; i<j; i+=batchSize) {
				nextBatch = result.groups.slice(i,i+batchSize);
				if (executor === null)
				{
					executor = Grade.putGlobalDisciplines(year.substr(0, 4), semester, nextBatch);
				} else {
					let f = function(batch) {
						return function (result) {
							let gradeResponse = result;
							return Grade.putGlobalDisciplines(year.substr(0, 4), semester, batch);
						};
					};
					executor = executor.then(f(nextBatch));
				}
			}
			executor.then(function(result) {
				// SyncLog.write('globalDisciplines', faculty.id, 'grade response', gradeResponse);
				logger.info({content: {
					// faculty: faculty.externalID,
					timestamp: new Date(),
					type: 'muam',
				}}, 'DONE', 'Sync muam disciplines');
				res.api.response();
			});

		}, function(error) {
			console.log(error);
			res.api.response();
		});

	} catch (err) {
		//await SyncLog.write('globalDisciplines', faculty.id, 'error', err);
		logger.error(err);
		res.api.response();
	}
//	res.api.response();
});

router.get('/phiz', async (req, res, next) => {
	const { year, semester } = req.query;

	try {
		logger.info({content: {
			//faculty: faculty.externalID,
			timestamp: new Date(),
			type: 'sport',
		}},  'START', 'Sync phiz disciplines');

		var officeGlobalDiscUrl = conf.office.phiz_url;

		Office.getGlobalDisciplines(officeGlobalDiscUrl, year, semester, function(result) {
			// SyncLog.write('globalDisciplines', faculty.id, 'office response', plans);
			let i=0,j=0;
			let batchSize = 40;
			let executor = null;
			let nextBatch = [];
			for (i,j=result.groups.length; i<j; i+=batchSize) {
				nextBatch = result.groups.slice(i,i+batchSize);
				if (executor === null)
				{
					executor = Grade.putGlobalDisciplines(year.substr(0, 4), semester, nextBatch);
				} else {
					let f = function(batch) {
						return function (result) {
							let gradeResponse = result;
							return Grade.putGlobalDisciplines(year.substr(0, 4), semester, batch);
						};
					};
					executor = executor.then(f(nextBatch));
				}
			}
			executor.then(function(result) {
				// SyncLog.write('globalDisciplines', faculty.id, 'grade response', gradeResponse);
				logger.info({content: {
					// faculty: faculty.externalID,
					timestamp: new Date(),
					type: 'sport',
				}}, 'DONE', 'Sync phiz disciplines');
				res.api.response();
			});

		}, function(error) {
			console.log(error);
			res.api.response();
		});

	} catch (err) {
		//await SyncLog.write('globalDisciplines', faculty.id, 'error', err);
		logger.error(err);
		res.api.response();
	}
//	res.api.response();
});


router.get('/dump', async (req, res, next) => {
	const { year, semester, usemongo, writefiles } = req.query;

	var officeGlobalDiscUrl = conf.office.url;
	var officeMuamDiscUrl = conf.office.muam_url;
	var officePhizDiscUrl = conf.office.phiz_url;

	try {
		logger.info({content: {
			//faculty: faculty.externalID,
			timestamp: new Date(),
			type: 'dump global',
		}}, 'START', 'Dump global disciplines');

		await Office.getGlobalDisciplines(officeGlobalDiscUrl, year, semester, function(result) {
			// SyncLog.write('globalDisciplines', faculty.id, 'office response', plans);
			disciplineList = result.groups;
			if (writefiles) {
				// do nothing, just get json from http endpoint yourself
			}
			if (usemongo === 'true') {
				GlobalDisciplines.collection.remove();
				SyncData.write('global_disciplines', null, disciplineList, null, false, { year: year.substr(0, 4), semester });
			}
			logger.info({content: {
				// faculty: faculty.externalID,
				timestamp: new Date(),
				type: 'dump global',
			}}, 'DONE', 'Dump globalDisciplines');

			Office.getGlobalDisciplines(officeMuamDiscUrl, year, semester, function(result) {
				// SyncLog.write('globalDisciplines', faculty.id, 'office response', plans);
				muamList = result.groups;
				if (writefiles) {
					// do nothing, just get json from http endpoint yourself
				}
				if (usemongo === 'true') {
					SyncData.write('global_disciplines', null, muamList, null, false, { year: year.substr(0, 4), semester });
				}
				logger.info({content: {
					// faculty: faculty.externalID,
					timestamp: new Date(),
					type: 'dump global',
				}}, 'DONE', 'Dump globalMuamDisciplines');

				Office.getGlobalDisciplines(officePhizDiscUrl, year, semester, function(result) {
					phizList = result.groups;
					if (writefiles) {
						// do nothing, just get json from http endpoint yourself
					}
					if (usemongo === 'true') {
						SyncData.write('global_disciplines', null, phizList, null, false, { year: year.substr(0, 4), semester });
					}
					logger.info({content: {
						// faculty: faculty.externalID,
						timestamp: new Date(),
						type: 'dump global',
					}}, 'DONE', 'Dump globalPhizDisciplines');

					if (usemongo === 'true') {
						Unpack.unpack_global_disciplines();
					}

				}, function(error) {
					console.log(error);
				});

			}, function(error) {
				console.log(error);
			});

		}, function(error) {
			console.log(error);
		});


		res.api.response();

	} catch (err) {
		//await SyncLog.write('globalDisciplines', faculty.id, 'error', err);
		logger.error(err);
	}


});

module.exports = router;
