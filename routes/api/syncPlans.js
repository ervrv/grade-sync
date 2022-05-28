const logger = require('../../lib/logger');
const Sync = require('../../model/sync');
const SyncLog = require('../../model/sync-log');
const Soap = require('../../model/soap');
const Grade = require('../../model/grade');
const Disciplines = require('../../model/disciplines');
const Promise = require('bluebird');
const moment = require('moment');

const syncDiscipline = async function (facultyID, soapDiscipline, year, semester, form) {
	await Disciplines.updateOne({
		externalID: soapDiscipline.externalID,
		type: soapDiscipline.type,
		planExternalID: soapDiscipline.planExternalID,
		learningPlanExtID: soapDiscipline.learningPlanExtID,
		form,
		year,
		semester,
	}, {
		$set: {
			form,
			year,
			semester,
			facultyID,
			planExternalID: soapDiscipline.planExternalID,
			learningPlanExtID: soapDiscipline.learningPlanExtID,
			externalID: soapDiscipline.externalID,
			global: soapDiscipline.global,
			name: soapDiscipline.name,
			type: soapDiscipline.type,
			teachers: soapDiscipline.teachers,
			course: soapDiscipline.course,
			grade: soapDiscipline.grade,
			controlSemester: soapDiscipline.controlSemester,
			controlYear: soapDiscipline.controlYear,
			mongoLastSync: moment().utc(),
		},
	}, { upsert: true });
};

const disciplinesAreEqual = async function (soapDiscipline, mongoDiscipline) {
	if (! mongoDiscipline) return false;

	const soapDisciplineKeys = Object.keys(soapDiscipline);
	for (let i = 0; i < soapDisciplineKeys.length; i++) {
		const key = soapDisciplineKeys[i];
		if (key === 'teachers') {
			if (soapDiscipline[key].length !== mongoDiscipline[key].length) return false;
			const sortedMongoTeachers = mongoDiscipline[key];
			const sortedSoapTeachers = soapDiscipline[key];
			for (let j = 0; j < soapDiscipline[key].length; j++) {
				if (sortedMongoTeachers[j].hashSnils !== sortedSoapTeachers[j].hashSnils) return false;
			}
		} else if (mongoDiscipline[key] !== soapDiscipline[key] && key !== 'facultyID') return false;
	}
	return true;
};

const syncPlansMongo = async function (year, semester, form) {
	await SyncLog.collection.deleteMany({});

	const syncCursor = await Sync.find({
		type: 'plans',
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
			}, 'START', 'Sync plans');

			const soapPlans = await Soap.getPlans(faculty.externalID, year.substr(0, 4), semester, form, soapLastDate);
			await SyncLog.write('plans', faculty.id, 'soap response', soapPlans);

			const soapDisciplines = [];
			await Promise.each(soapPlans, async (soapPlan) => {
				soapPlan.disciplines.forEach(discipline => soapDisciplines.push({
					facultyID: faculty.id,
					year: year.substr(0, 4),
					semester,
					form,
					planExternalID: soapPlan.externalID,
					learningPlanExtID: soapPlan.learningPlanExtID,
					externalID: discipline.externalID,
					global: discipline.global,
					name: discipline.name,
					type: discipline.type,
					teachers: discipline.teachers,
					course: discipline.course,
					grade: discipline.grade,
					controlSemester: discipline.semester,
					controlYear: discipline.year.substr(0, 4),
				}));
			});
			await SyncLog.write('disciplines', faculty.id, 'soap response', soapDisciplines);

			const mongoDisciplines = await Disciplines.find({
				facultyID: faculty.id, year: year.substr(0, 4), semester, form,
			}).lean();
			await SyncLog.write('disciplines', faculty.id, 'mongo response', mongoDisciplines);

			await Promise.each(soapDisciplines, async (soapDiscipline) => {
				const mongoDiscipline = await mongoDisciplines.find(discipline =>
					discipline.externalID === soapDiscipline.externalID && discipline.type === soapDiscipline.type &&
					discipline.planExternalID === soapDiscipline.planExternalID &&
					discipline.learningPlanExtID === soapDiscipline.learningPlanExtID);

				if (! await disciplinesAreEqual(soapDiscipline, mongoDiscipline)) {
					await syncDiscipline(faculty.id, soapDiscipline, year.substr(0, 4), semester, form);
					await Disciplines.updateMany({
						planExternalID: soapDiscipline.planExternalID,
						learningPlanExtID: soapDiscipline.learningPlanExtID,
					}, {
						mongoLastSync: moment.utc(),
					});
				}
			});

			logger.info({
				content: {
					faculty: faculty.externalID,
					timestamp: soapLastDate,
					type: 'sync',
				},
			}, 'DONE', 'Sync plans');
		} catch (err) {
			await SyncLog.write('plans', faculty.id, 'error', err);
			logger.error(err);
		}
	});
};

const syncPlansGrade = async function (year, semester, form) {
	await SyncLog.collection.deleteMany({});

	const syncCursor = await Sync.find({
		type: 'plans',
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
			}, 'START', 'Sync plans');

			const disciplinesToUpdate = await Disciplines.find({
				facultyID: faculty.id,
				year: year.substr(0, 4),
				semester,
				form,
				$where: 'new Date(this.gradeLastSync) <= new Date(this.mongoLastSync) || ! this.gradeLastSync',
			}, {
				gradeLastSync: 0, mongoLastSync: 0, _id: 0, __v: 0, facultyID: 0, year: 0, semester: 0, form: 0,
			}).lean();

			const plansToUpdate = [];
			await Promise.each(disciplinesToUpdate, async (discipline) => {
				const { planExternalID } = discipline;
				const { learningPlanExtID } = discipline;
				discipline.year = discipline.controlYear;
				discipline.semester = discipline.controlSemester;
				delete discipline.planExternalID;
				delete discipline.learningPlanExtID;
				delete discipline.controlYear;
				delete discipline.controlSemester;
				const existingPlanInd = plansToUpdate.findIndex(plan =>
					plan.externalID === planExternalID && plan.learningPlanExtID === learningPlanExtID);
				if (existingPlanInd !== -1) {
					plansToUpdate[existingPlanInd].disciplines.push(discipline);
				} else {
					const newPlan = {};
					newPlan.externalID = planExternalID;
					newPlan.learningPlanExtID = learningPlanExtID;
					newPlan.disciplines = [discipline];
					plansToUpdate.push(newPlan);
				}
			});

			const finalGradeResponse = [];
			let part = 1;
			for (let ptr = 0; ptr < plansToUpdate.length; ptr += 20) {
				const plansPart = plansToUpdate.slice(ptr, ptr + 20);

				logger.info({
					content: {
						faculty: faculty.externalID,
						timestamp: soapLastDate,
						type: 'sync',
					},
				}, `PART ${part} / ${plansPart.length} START`, 'Sync plans');

				const gradeResponse = await Grade.putPlans(faculty.externalID, year.substr(0, 4), semester, plansPart, form);
				finalGradeResponse.concat(gradeResponse.response);

				logger.info({
					content: {
						faculty: faculty.externalID,
						timestamp: soapLastDate,
						type: 'sync',
					},
				}, `PART ${part} / ${plansPart.length} DONE`, 'Sync plans');
				part++;
			}
			await SyncLog.write('plans', faculty.id, 'grade response', { finalGradeResponse });

			await Disciplines.updateMany({
				facultyID: faculty.id,
				$where: 'new Date(this.gradeLastSync) <= new Date(this.mongoLastSync) || ! this.gradeLastSync',
			}, { $currentDate: { gradeLastSync: true } });
		} catch (err) {
			await SyncLog.write('plans', faculty.id, 'error', err);
			logger.error(err);
		}
	});
};

module.exports = {
	syncPlansMongo,
	syncPlansGrade,
};
