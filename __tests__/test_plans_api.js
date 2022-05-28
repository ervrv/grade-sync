/* globals describe, it, afterAll, beforeAll, jest, expect */
const Disciplines = require('../model/disciplines');
const syncPlans = require('../routes/api/syncPlans');
const mongoose = require('mongoose');
const conf = require('../conf');
const logger = require('../lib/logger');
const Soap = require('../model/soap');
const Grade = require('../model/grade');
const connectToTestDB = require('../boot/mongo_test');

jest.mock('../model/soap/plans');
Grade.putPlans = jest.fn().mockResolvedValue(['']);
jest.setTimeout(20000);

beforeAll(async () => {
	try {
		await connectToTestDB();
		await Disciplines.deleteMany({});
	} catch (err) {
		logger.error(err);
		process.exit(1);
	}
});

afterAll(async () => {
	try {
		await Disciplines.deleteMany({});
		await mongoose.connection.close();
	} catch (err) {
		logger.error(err);
		process.exit(1);
	}
});

describe('Plans', () => {
	try {
		it('syncs 3 new plans', async () => {
			await syncPlans.syncPlansMongo('2021', '1', '1');
			await syncPlans.syncPlansGrade('2021', '1', '1');
			const expected = await Soap.getPlans();
			expect(Grade.putPlans.mock.calls[0][3].length).toEqual(expected.length);
			await expected.forEach((plan) => {
				const resPlan = Grade.putPlans.mock.calls[0][3].find(resPln => resPln.externalID === plan.externalID &&
					resPln.learningPlanExtID === plan.learningPlanExtID);
				expect(resPlan.disciplines).toEqual(plan.disciplines);
			});
		});

		it('syncs 1 plan with 1 new discipline', async () => {
			conf.testCase = '1';
			await syncPlans.syncPlansMongo('2021', '1', '1');
			await syncPlans.syncPlansGrade('2021', '1', '1');
			const expected = [{
				externalID: '000146242',
				learningPlanExtID: '000146241',
				disciplines: [
					{
						externalID: '000051837',
						name: 'Research Work (Научно-исследовательская работа)',
						type: 'Зачет',
						global: '0',
						teachers: [{ hashSnils: '' }],
						course: '1',
						grade: 'Магистратура',
						year: '2021',
						semester: '1',
					},
					{
						externalID: '000055047',
						name: 'Research Work (Научно-исследовательская работа)',
						type: 'Зачет',
						global: '0',
						teachers: [{ hashSnils: 'A672CB69245A8FDF4548FA50B10D2DC14DF90A96' }],
						course: '1',
						grade: 'Магистратура',
						year: '2021',
						semester: '2',
					},
				],
			}];
			expect(Grade.putPlans.mock.calls[1][3].length).toEqual(expected.length);
			await expected.forEach((plan) => {
				const resPlan = (Grade.putPlans.mock.calls[1][3].find(resPln => resPln.externalID === plan.externalID &&
					resPln.learningPlanExtID === plan.learningPlanExtID));
				expect(resPlan.disciplines).toEqual(plan.disciplines);
			});
		});

		it('syncs 1 plan with 1 discipline updated', async () => {
			conf.testCase = '2';
			await syncPlans.syncPlansMongo('2021', '1', '1');
			await syncPlans.syncPlansGrade('2021', '1', '1');
			const expected = [{
				externalID: '000146242',
				learningPlanExtID: '000146241',
				disciplines: [
					{
						externalID: '000051837',
						name: 'Research Work (Научно-исследовательская работа)',
						type: 'Зачет',
						global: '0',
						teachers: [{ hashSnils: 'A672CB69245A8FDF4548FA50B10D2DC14DF90A96' }],
						course: '1',
						grade: 'Магистратура',
						year: '2021',
						semester: '1',
					},
					{
						externalID: '000055047',
						name: 'Research Work (Научно-исследовательская работа)',
						type: 'Зачет',
						global: '0',
						teachers: [{ hashSnils: 'A672CB69245A8FDF4548FA50B10D2DC14DF90A96' }],
						course: '1',
						grade: 'Магистратура',
						year: '2021',
						semester: '2',
					},
				],
			}];
			expect(Grade.putPlans.mock.calls[2][3].length).toEqual(expected.length);
			await expected.forEach((plan) => {
				const resPlan = (Grade.putPlans.mock.calls[2][3].find(resPln => resPln.externalID === plan.externalID &&
					resPln.learningPlanExtID === plan.learningPlanExtID));
				expect(resPlan.disciplines).toEqual(plan.disciplines);
			});
		});

		it('syncs 1 plan with 1 discipline updated', async () => {
			conf.testCase = '3';
			await syncPlans.syncPlansMongo('2021', '1', '1');
			await syncPlans.syncPlansGrade('2021', '1', '1');
			const expected = [{
				externalID: '000146242',
				learningPlanExtID: '000146241',
				disciplines: [
					{
						externalID: '000051837',
						name: 'Research Work (Научно-исследовательская работа)',
						type: 'Зачет',
						global: '0',
						teachers: [{ hashSnils: '' }],
						course: '1',
						grade: 'Магистратура',
						year: '2021',
						semester: '2',
					},
					{
						externalID: '000055047',
						name: 'Research Work (Научно-исследовательская работа)',
						type: 'Зачет',
						global: '0',
						teachers: [{ hashSnils: 'A672CB69245A8FDF4548FA50B10D2DC14DF90A96' }],
						course: '1',
						grade: 'Магистратура',
						year: '2021',
						semester: '2',
					},
				],
			}];
			expect(Grade.putPlans.mock.calls[3][3].length).toEqual(expected.length);
			await expected.forEach((plan) => {
				const resPlan = (Grade.putPlans.mock.calls[3][3].find(resPln => resPln.externalID === plan.externalID &&
					resPln.learningPlanExtID === plan.learningPlanExtID));
				expect(resPlan.disciplines).toEqual(plan.disciplines);
			});
			Grade.putPlans.mockClear();
		});
	} catch (err) {
		logger.error(err);
		process.exit(1);
	}
});

