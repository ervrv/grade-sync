/* globals describe, it, afterAll, beforeAll, jest, expect */
const Students = require('../model/students');
const syncStudents = require('../routes/api/syncStudents');
const mongoose = require('mongoose');
const conf = require('../conf');
const logger = require('../lib/logger');
const Soap = require('../model/soap');
const Grade = require('../model/grade');
const connectToTestDB = require('../boot/mongo_test');

jest.mock('../model/soap/students');
Grade.putStudents = jest.fn().mockResolvedValue(['']);
jest.setTimeout(20000);

beforeAll(async () => {
	try {
		await connectToTestDB();
		await Students.deleteMany({});
	} catch (err) {
		logger.error(err);
		process.exit(1);
	}
});

afterAll(async () => {
	try {
		await Students.deleteMany({});
		await mongoose.connection.close();
	} catch (err) {
		logger.error(err);
		process.exit(1);
	}
});

describe('Students', () => {
	try {
		it('syncs 5 students', async () => {
			await syncStudents.syncStudentsMongo();
			await syncStudents.syncStudentsGrade();
			const expected = await Soap.getStudents();
			expect(Grade.putStudents.mock.calls[0][1].length).toEqual(expected.length);
			await expected.forEach((student) => {
				const resStudent = (Grade.putStudents.mock.calls[0][1]
					.find(resStdnt => resStdnt.externalID === student.externalID));
				expect(resStudent).toEqual(student);
			});
		});

		it('syncs 1 student with 1 new recordBook', async () => {
			conf.testCase = '1';
			const expected = [{
				externalID: '000329571',
				firstName: 'Олег',
				secondName: 'Игоревич',
				lastName: 'Абрамов',
				recordBooks: [{
					externalID: 'ММ-20-0096',
					planExternalID: '000148902',
					facultyExternalID: '000001387',
					status: 'Учится',
					degree: 'Бакалавр',
					form: 'Очная',
					speciality: '01.03.02 - Прикладная математика и информатика',
					grade: '2',
					group: '20ММ-01.03.02.02-о4',
				}],
			}];
			await syncStudents.syncStudentsMongo();
			await syncStudents.syncStudentsGrade();
			expect(Grade.putStudents.mock.calls[1][1].length).toEqual(expected.length);
			await expected.forEach((student) => {
				const resStudent = (Grade.putStudents.mock.calls[1][1]
					.find(resStdnt => resStdnt.externalID === student.externalID));
				expect(resStudent).toEqual(student);
			});
		});

		it('syncs 1 student with 1 recordBook updated', async () => {
			conf.testCase = '2';
			await syncStudents.syncStudentsMongo();
			await syncStudents.syncStudentsGrade();
			const expected = [{
				externalID: '000387061',
				firstName: 'Виктория',
				secondName: 'Рахимжоновна',
				lastName: 'Абдумаликова',
				recordBooks: [{
					externalID: 'ДО-ММ-21-0187',
					planExternalID: '000152378',
					facultyExternalID: '000001387',
					status: 'Учится',
					degree: 'Дополнительная общеразвивающая программа',
					form: 'Очная',
					speciality: '02.00.01 - Информатика. Пользователь компьютера плюс',
					grade: '1',
					group: '77',
				},
				{
					externalID: 'ДО-ММ-21-0347',
					planExternalID: '000152378',
					facultyExternalID: '000001387',
					status: 'Учится',
					degree: 'Дополнительная общеразвивающая программа',
					form: 'Очная',
					speciality: '02.00.01 - Информатика. Пользователь компьютера плюс',
					grade: '1',
					group: '45',
				}],
			}];
			expect(Grade.putStudents.mock.calls[2][1].length).toEqual(expected.length);
			await expected.forEach((student) => {
				const resStudent = (Grade.putStudents.mock.calls[2][1]
					.find(resStdnt => resStdnt.externalID === student.externalID));
				expect(resStudent).toEqual(student);
			});
		});

		it('syncs 1 student with 1 recordBook updated', async () => {
			conf.testCase = '3';
			await syncStudents.syncStudentsMongo();
			await syncStudents.syncStudentsGrade();
			const expected = [{
				externalID: '000330498',
				firstName: 'Магомедали',
				secondName: 'Абдурахманович',
				lastName: 'Абдурахманов',
				recordBooks: [{
					externalID: 'ММ-20-0179',
					planExternalID: '000148891',
					facultyExternalID: '000001387',
					status: 'Учится',
					degree: 'Бакалавр',
					form: 'Очная',
					speciality: '44.03.05 - Педагогическое образование (с двумя профилями подготовки)',
					grade: '1',
					group: '20ММ-44.03.05.01-о1',
				}],
			}, {
				externalID: '000387061',
				firstName: 'Виктория',
				secondName: 'Рахимжоновна',
				lastName: 'Абдумаликова',
				recordBooks: [{
					externalID: 'ДО-ММ-21-0187',
					planExternalID: '000152378',
					facultyExternalID: '000001387',
					status: 'Учится',
					degree: 'Дополнительная общеразвивающая программа',
					form: 'Очная',
					speciality: '02.00.01 - Информатика. Пользователь компьютера плюс',
					grade: '1',
					group: '77',
				}],
			}];
			expect(Grade.putStudents.mock.calls[3][1].length).toEqual(expected.length);
			await expected.forEach((student) => {
				const resStudent = (Grade.putStudents.mock.calls[3][1]
					.find(resStdnt => resStdnt.externalID === student.externalID));
				expect(resStudent).toEqual(student);
			});
			Grade.putStudents.mockClear();
		});
	} catch (err) {
		logger.error(err);
		process.exit(1);
	}
});

