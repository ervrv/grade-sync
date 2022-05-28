const logger = require('../../lib/logger');
const Sync = require('../../model/sync');
const SyncLog = require('../../model/sync-log');
const Soap = require('../../model/soap');
const Grade = require('../../model/grade');
const Students = require('../../model/students');
const Promise = require('bluebird');
const moment = require('moment');
const conf = require('../../conf');

const syncStudent = async function (facultyID, soapStudent) {
	await Students.updateOne({
		externalID: soapStudent.externalID,
	}, {
		$set: {
			facultyID,
			firstName: soapStudent.firstName,
			secondName: soapStudent.secondName,
			lastName: soapStudent.lastName,
			recordBooks: soapStudent.recordBooks,
			mongoLastSync: moment().utc(),
		},
	}, { upsert: true });
};

const studentsAreEqual = async function (soapStudent, mongoStudent) {
	if (! mongoStudent) return false;
	const soapStudentKeys = Object.keys(soapStudent);
	for (let i = 0; i < soapStudentKeys.length; i++) {
		const key = soapStudentKeys[i];
		if (key === 'recordBooks') {
			if (soapStudent[key].length !== mongoStudent[key].length) return false;
			const sortedSoapBooks = soapStudent[key].sort();
			const sortedMongoBooks = mongoStudent[key].sort();
			for (let j = 0; j < sortedSoapBooks.length; j++) {
				const soapRecordBook = sortedSoapBooks[j];
				const mongoRecordBook = sortedMongoBooks[j];
				const recordBooksKeys = Object.keys(soapRecordBook);
				for (let k = 0; k < recordBooksKeys.length; k++) {
					const keyRecB = recordBooksKeys[k];
					if (soapRecordBook[keyRecB] !== mongoRecordBook[keyRecB]) return false;
				}
			}
		} else if (soapStudent[key] !== mongoStudent[key] && key !== 'facultyID') return false;
	}
	return true;
};

const deleteStudents = async function (mongoStudentsToDelete) {
	Promise.each(mongoStudentsToDelete, async (students) => {
		// TODO
	});
};

const syncStudentsMongo = async function (enableDismissed) {
	await SyncLog.collection.deleteMany({});

	const syncCursor = await Sync.find({
		type: 'students',
		enabled: true,
	}).cursor();

	await syncCursor.eachAsync(async (sync) => {
		const faculty = await sync.faculty();
		const soapLastDate = await sync.soapLastDate();

		try {
			logger.info({
				content: {
					faculty: faculty.externalID,
					timestamp: soapLastDate,
					type: 'sync',
				},
			}, 'START', 'Sync students');

			const soapStudents = await Soap.getStudents(faculty.externalID, enableDismissed, soapLastDate);
			await SyncLog.write('students', faculty.id, 'soap response', soapStudents);

			const mongoStudents = await Students.find({ facultyID: faculty.id }).lean();
			await SyncLog.write('students', faculty.id, 'mongo response', mongoStudents);

			let mongoStudentsToDelete = mongoStudents;
			await Promise.each(soapStudents, async (soapStudent) => {
				const mongoStudent = await mongoStudents.find(student => soapStudent.externalID === student.externalID);
				mongoStudentsToDelete = mongoStudentsToDelete.filter(student => soapStudent.externalID !== student.externalID);

				if (! await studentsAreEqual(soapStudent, mongoStudent)) {
					await syncStudent(faculty.id, soapStudent);
				}
			});

			logger.info({
				content: {
					faculty: faculty.externalID,
					timestamp: soapLastDate,
					type: 'sync',
				},
			}, 'DONE', 'Sync students');

			// await deleteStudents(mongoStudentsToDelete);
		} catch (err) {
			await SyncLog.write('students', faculty.id, 'error', err);
			logger.error(err);
		}
	});
};

const syncStudentsGrade = async function () {
	await SyncLog.collection.deleteMany({});

	const syncCursor = Sync.find({
		type: 'students',
		enabled: true,
	}).cursor();

	await syncCursor.eachAsync(async (sync) => {
		const faculty = await sync.faculty();
		const soapLastDate = sync.soapLastDate();

		try {
			logger.info({
				content: {
					faculty: faculty.externalID,
					timestamp: soapLastDate,
					type: 'sync',
				},
			}, 'START', 'Sync students');

			const studentsToSync = await Students.find({
				facultyID: faculty.id,
				$where: 'new Date(this.gradeLastSync) <= new Date(this.mongoLastSync) || ! this.gradeLastSync',
			}, {
				gradeLastSync: 0, mongoLastSync: 0, _id: 0, __v: 0, facultyID: 0,
			}).lean();
			await SyncLog.write('students', faculty.id, 'mongo response', studentsToSync);

			const gradeResponse = await Grade.putStudents(faculty.externalID, studentsToSync);
			await SyncLog.write('students', faculty.id, 'grade response', gradeResponse);

			await Students.updateMany({
				facultyID: faculty.id,
				$where: 'new Date(this.gradeLastSync) <= new Date(this.mongoLastSync) || ! this.gradeLastSync',
			}, { $currentDate: { gradeLastSync: true } });

			logger.info({
				content: {
					faculty: faculty.externalID,
					timestamp: soapLastDate,
					type: 'sync',
				},
			}, 'DONE', 'Sync students');

			if (conf.params.saveDates) {
				sync.lastDate = Date.now();
				await sync.save();
			}
		} catch (err) {
			await SyncLog.write('students', faculty.id, 'error', err);
			logger.error(err);
		}
	});
};

module.exports = {
	syncStudentsMongo,
	syncStudentsGrade,
};
