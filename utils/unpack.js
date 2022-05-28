const logger = require('../lib/logger');
const Teachers = require('../model/teachers');
const Students = require('../model/students');
const Plans = require('../model/plans');
const Disciplines = require('../model/disciplines');
const GlobalDisciplines = require('../model/global_discipline');
const SyncData = require('../model/sync-data');

// use as node /bin/unpack_data.js <faculty mongo id> <teachers|plans|students>


const unpackTeacersFromJson = async function (fId, content) {
	content.forEach((teacher) => {
		Teachers.write(
			fId,
			teacher.externalID,
			teacher.inila,
			teacher.firstName,
			teacher.secondName,
			teacher.lastName,
			teacher.jobPositionName,
			teacher.status,
			teacher.departmentExternalID,
		);
	});
};

const unpackTeachers = async function (fId) {
	let syncDataCursor = null;
	if (fId) {
		syncDataCursor = SyncData.find({
			type: 'teachers',
			facultyId: fId,
		})
			.cursor();
	} else {
		syncDataCursor = SyncData.find({
			type: 'teachers',
		})
			.cursor();
	}
	await syncDataCursor.eachAsync(async (sync) => {
		const faculty = await sync.faculty();

		try {
			logger.info('START', 'un000211364 pack teachers', {
				faculty: faculty.externalID,
			});

			await unpackTeacersFromJson(faculty.id, sync.content);

			logger.info('DONE', 'unpack teachers', {
				faculty: faculty.externalID,
			});

			sync.completed = true;
			// sync.lastDate = Date.now();
			await sync.save();
		} catch (err) {
			logger.error(err);
		}
	});
};

const unpackStudents = async function (fId) {
	let syncDataCursor = null;
	if (fId) {
		syncDataCursor = SyncData.find({
			type: 'students',
			facultyId: fId,
		})
			.cursor();
	} else {
		syncDataCursor = SyncData.find({
			type: 'students',
		})
			.cursor();
	}
	await syncDataCursor.eachAsync(async (sync) => {
		const faculty = await sync.faculty();

		try {
			logger.info('START', 'unpack students', {
				faculty: faculty.externalID,
			});

			sync.content.forEach((student) => {
				Students.write(
					faculty.id,
					student.externalID,
					student.firstName,
					student.secondName,
					student.lastName,
					student.recordBooks,
				);
			});

			logger.info('DONE', 'unpack students', {
				faculty: faculty.externalID,
			});

			sync.completed = true;
			// sync.lastDate = Date.now();
			await sync.save();
		} catch (err) {
			logger.error(err);
		}
	});
};

const unpackPlans = async function (fId) {
	let syncDataCursor = null;
	if (fId) {
		syncDataCursor = SyncData.find({
			type: 'plans',
			facultyId: fId,
		})
			.cursor();
	} else {
		syncDataCursor = SyncData.find({
			type: 'plans',
		})
			.cursor();
	}
	await syncDataCursor.eachAsync(async (sync) => {
		const faculty = await sync.faculty();

		try {
			logger.info('START', 'unpack plans', {
				faculty: faculty.externalID,
			});

			sync.content.forEach((plan) => {
				Plans.write(
					faculty.id,
					plan.externalID,
					plan.learningPlanExtID,
					plan.disciplines,
					sync.params.year,
					sync.params.semester,
					sync.params.form,
				);
			});

			logger.info('DONE', 'unpack plans', {
				faculty: faculty.externalID,
			});

			sync.completed = true;
			// sync.lastDate = Date.now();
			await sync.save();
		} catch (err) {
			logger.error(err);
		}
	});
};


const unpackDisciplines = async function (fId) {
	let syncDataCursor = null;
	if (fId) {
		syncDataCursor = SyncData.find({
			type: 'plans',
			facultyId: fId,
		})
			.cursor();
	} else {
		syncDataCursor = SyncData.find({
			type: 'plans',
		})
			.cursor();
	}
	await syncDataCursor.eachAsync(async (sync) => {
		const faculty = await sync.faculty();

		try {
			logger.info('START', 'unpack plans', {
				faculty: faculty.externalID,
			});

			sync.content.forEach((plan) => {
				plan.disciplines.forEach((discipline) => {
					Disciplines.write(
						faculty.id,
						plan.externalID,
						plan.learningPlanExtID,
						discipline.name,
						discipline.externalID,
						discipline.type,
						discipline.global,
						discipline.teachers,
						sync.params.year,
						sync.params.semester,
						sync.params.form,
						discipline.year,
						discipline.semester,
						discipline.course,
						discipline.grade,
					);
				});
			});

			logger.info('DONE', 'unpack plans', {
				faculty: faculty.externalID,
			});

			sync.completed = true;
			// sync.lastDate = Date.now();
			await sync.save();
		} catch (err) {
			logger.error(err);
		}
	});
};

const unpackGlobalDisciplines = async function () {
	let syncDataCursor = null;

	syncDataCursor = SyncData.find({
		type: 'global_disciplines',
		completed: false,
	}).cursor();

	await syncDataCursor.eachAsync(async (sync) => {
		try {
			logger.info('START', 'unpack global disciplines', {});

			sync.content.forEach((discipline) => {
				GlobalDisciplines.write(
					discipline.faculty,
					discipline.name,
					discipline.subject,
					discipline.externalID,
					discipline.students,
					discipline.teachers,
					sync.params.year,
					sync.params.semester,
				);
			});

			logger.info('DONE', 'global disciplines', {
			});

			sync.completed = true;
			// sync.lastDate = Date.now();
			await sync.save();
		} catch (err) {
			logger.error(err);
		}
	});
};

module.exports = {
	unpack_teachers: unpackTeachers,
	unpack_teachers_json: unpackTeacersFromJson,
	unpack_plans: unpackPlans,
	unpack_students: unpackStudents,
	unpack_disciplines: unpackDisciplines,
	unpack_global_disciplines: unpackGlobalDisciplines,
};

