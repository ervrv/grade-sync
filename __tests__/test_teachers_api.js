/* globals describe, it, afterAll, beforeAll, jest, expect */
const Teachers = require('../model/teachers');
const syncTeachers = require('../routes/api/syncTeachers');
const mongoose = require('mongoose');
const conf = require('../conf');
const logger = require('../lib/logger');
const Soap = require('../model/soap');
const Grade = require('../model/grade');
const connectToTestDB = require('../boot/mongo_test');

jest.mock('../model/soap/teachers');
Grade.putTeachers = jest.fn().mockResolvedValue(['']);
jest.setTimeout(20000);

beforeAll(async () => {
	try {
		await connectToTestDB();
		await Teachers.deleteMany({});
	} catch (err) {
		logger.error(err);
		process.exit(1);
	}
});

afterAll(async () => {
	try {
		await Teachers.deleteMany({});
		await mongoose.connection.close();
	} catch (err) {
		logger.error(err);
		process.exit(1);
	}
});

describe('Teachers', () => {
	try {
		it('syncs 5 teachers', async () => {
			await syncTeachers.syncTeachersMongo();
			await syncTeachers.syncTeachersGrade();
			const expected = await Soap.getTeachers();
			expect(Grade.putTeachers.mock.calls[0][1].sort()).toEqual(expected.sort());
		});

		it('syncs 1 teacher with 1 field updated', async () => {
			conf.testCase = '1';
			const expected = [{
				departmentExternalID: '000001101',
				externalID: '000073199',
				firstName: 'Татьяна',
				secondName: 'Алексеевна',
				lastName: 'Бутко',
				status: 'Работает',
				jobPositionName: 'Ассистент',
				inila: '04B59431E08F81534BDDFC4995ABC02D149134BD',
			}];
			await syncTeachers.syncTeachersMongo();
			await syncTeachers.syncTeachersGrade();
			expect(Grade.putTeachers.mock.calls[1][1].sort()).toEqual(expected.sort());
		});

		it('syncs 1 new updated teachers', async () => {
			conf.testCase = '2';
			await syncTeachers.syncTeachersMongo();
			await syncTeachers.syncTeachersGrade();
			const expected = [{
				departmentExternalID: '000001387',
				externalID: '000072474',
				firstName: 'Анна',
				secondName: 'Владимировна',
				lastName: 'Абрамян',
				status: 'Работает',
				jobPositionName: 'Доцент',
				inila: 'D8EE6595B33943CB102BC0AF5143F130008AE820',
			}];
			expect(Grade.putTeachers.mock.calls[2][1].sort()).toEqual(expected.sort());
		});

		it('syncs 1 teacher with all fields updated', async () => {
			conf.testCase = '3';
			await syncTeachers.syncTeachersMongo();
			await syncTeachers.syncTeachersGrade();
			const expected = [{
				departmentExternalID: '123456789',
				externalID: '000073199',
				firstName: 'Дарья',
				secondName: 'Вячеславовна',
				lastName: 'Иваницкая',
				status: 'Играет',
				jobPositionName: 'Отчилена',
				inila: '04B59431E00D7B534BDDFC4995ABF4GD149134BD',
			}];
			expect(Grade.putTeachers.mock.calls[3][1].sort()).toEqual(expected.sort());
			Grade.putTeachers.mockClear();
		});
	} catch (err) {
		logger.error(err);
		process.exit(1);
	}
});

