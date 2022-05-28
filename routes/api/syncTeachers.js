const logger = require('../../lib/logger');
const Promise = require('bluebird');
const Sync = require('../../model/sync');
const SyncLog = require('../../model/sync-log');
const Soap = require('../../model/soap');
const Grade = require('../../model/grade');
const Teachers = require('../../model/teachers');
const conf = require('../../conf');
const moment = require('moment');
const mongoose = require('mongoose');

const syncTeacher = async function (facultyID, soapTeacher) {
	await Teachers.updateOne({ externalID: soapTeacher.externalID }, {
		$set: {
			externalID: soapTeacher.externalID,
			inila: soapTeacher.inila,
			facultyID: mongoose.Types.ObjectId(facultyID),
			firstName: soapTeacher.firstName,
			secondName: soapTeacher.secondName,
			lastName: soapTeacher.lastName,
			jobPositionName: soapTeacher.jobPositionName,
			status: soapTeacher.status,
			departmentExternalID: soapTeacher.departmentExternalID,
			mongoLastSync: moment().utc(),
		},
	}, { upsert: true });
};

const deleteTeachers = async function (mongoTeachersToDelete) {
	Promise.each(mongoTeachersToDelete, async (teacher) => {
		// TODO
	});
};

const teachersAreEqual = async function (mongoTeacher, soapTeacher) {
	if (! mongoTeacher) return false;

	const soapTeacherKeys = Object.keys(soapTeacher);

	for (let i = 0; i < soapTeacherKeys.length; i++) {
		const key = soapTeacherKeys[i];
		if (mongoTeacher[key] !== soapTeacher[key]) return false;
	}
	return true;
};

const removeDuplicates = async function (arr) {
	const result = [];
	const duplicatesIndices = [];

	await arr.forEach((current, index) => {
		if (duplicatesIndices.includes(index)) return;
		result.push(current);

		for (let comparisonIndex = index + 1; comparisonIndex < arr.length; comparisonIndex++) {
			const comparison = arr[comparisonIndex];
			if (current.externalID === comparison.externalID) duplicatesIndices.push(comparisonIndex);
		}
	});
	return result;
};

const syncTeachersMongo = async function (enableDismissed) {
	await SyncLog.collection.deleteMany({});

	const syncCursor = await Sync.find({
		type: 'teachers',
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
			}, 'START', 'Sync teachers');

			const rawSoapTeachers = await Soap.getTeachers(faculty.externalID, enableDismissed, soapLastDate);
			const soapTeachers = await removeDuplicates(rawSoapTeachers);
			await SyncLog.write('teachers', faculty.id, 'soap response', soapTeachers);

			const mongoTeachers = await Teachers.find({ facultyID: faculty.id }).lean();
			await SyncLog.write('teachers', faculty.id, 'mongo response', mongoTeachers);

			let mongoTeachersToDelete = mongoTeachers;
			await Promise.each(soapTeachers, async (soapTeacher) => {
				const mongoTeacher = await mongoTeachers.find(teacher => soapTeacher.externalID === teacher.externalID);
				mongoTeachersToDelete = mongoTeachersToDelete.filter(teacher => teacher.externalID !== soapTeacher.externalID);

				if (! await teachersAreEqual(mongoTeacher, soapTeacher)) {
					await syncTeacher(faculty.id, soapTeacher);
				}
			});

			logger.info({
				content: {
					faculty: faculty.externalID,
					timestamp: soapLastDate,
					type: 'sync',
				},
			}, 'DONE', 'Sync teachers');

			// await deleteTeachers(mongoTeachersToDelete);
		} catch (err) {
			await SyncLog.write('teachers', faculty.id, 'error', err);
			logger.error(err);
		}
	});
};

const syncTeachersGrade = async function () { // facultyID) {
	await SyncLog.collection.deleteMany({});

	const syncCursor = Sync.find({
		type: 'teachers',
		enabled: true,
	}).cursor();

	// let syncCursor;
	// if (! facultyID) {
	// 	syncCursor = Sync.find({
	// 		type: 'teachers',
	// 		enabled: true,
	// 	}).cursor();
	// } else {
	// 	syncCursor = Sync.find({
	// 		type: 'teachers',
	// 		enabled: true,
	// 		facultyID,
	// 	}).cursor();
	// }

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
			}, 'START', 'Sync teachers');

			const teachersToSync = await Teachers.find({
				facultyID: faculty.id,
				$where: 'new Date(this.gradeLastSync) <= new Date(this.mongoLastSync) || ! this.gradeLastSync',
			}, {
				gradeLastSync: 0, mongoLastSync: 0, _id: 0, __v: 0, facultyID: 0,
			}).lean();
			await SyncLog.write('teachers', faculty.id, 'mongo response', teachersToSync);

			const gradeResponse = await Grade.putTeachers(faculty.externalID, teachersToSync);
			await SyncLog.write('teachers', faculty.id, 'grade response', gradeResponse);

			await Teachers.updateMany({
				facultyID: faculty.id,
				$where: 'new Date(this.gradeLastSync) <= new Date(this.mongoLastSync) || ! this.gradeLastSync',
			}, { $currentDate: { gradeLastSync: true } });

			logger.info({
				content: {
					faculty: faculty.externalID,
					timestamp: soapLastDate,
					type: 'sync',
				},
			}, 'DONE', 'Sync teachers');

			if (conf.params.saveDates) {
				sync.lastDate = Date.now();
				await sync.save();
			}
		} catch (err) {
			await SyncLog.write('teachers', faculty.id, 'error', err);
			logger.error(err);
		}
	});
};

module.exports = {
	syncTeachersMongo,
	syncTeachersGrade,
};
