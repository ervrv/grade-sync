const Promise = require('bluebird');
const conf = require('../../../conf/app_config');

const getStudents = async function () {
	const soapResponseStudents = [{
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
	},
	{
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
			grade: '2',
			group: '20ММ-44.03.05.01-о1',
		}],
	},
	{
		externalID: '000256702',
		firstName: 'Азиза',
		secondName: 'Раульевна',
		lastName: 'Абдурашидова',
		recordBooks: [{
			externalID: 'ММ-18-0210',
			planExternalID: '000134324',
			facultyExternalID: '000001387',
			status: 'Учится',
			degree: 'Прикладной бакалавр',
			form: 'Очная',
			speciality: '44.03.05 - Педагогическое образование (с двумя профилями подготовки)',
			grade: '4',
			group: '11',
		}],
	},
	{
		externalID: '000210432',
		firstName: 'Холис',
		secondName: '',
		lastName: 'Абдухоликзода',
		recordBooks: [{
			externalID: 'ММ-17-0235',
			planExternalID: '000132038',
			facultyExternalID: '000001387',
			status: 'Учится',
			degree: 'Академический бакалавр',
			form: 'Очная',
			speciality: '01.03.02 - Прикладная математика и информатика',
			grade: '4',
			group: '1',
		}],
	},
	{
		externalID: '000220856',
		firstName: 'Екатерина',
		secondName: 'Рафаиловна',
		lastName: 'Абелова',
		recordBooks: [{
			externalID: 'ММ-18-0261',
			planExternalID: '000133409',
			facultyExternalID: '000001387',
			status: 'Учится',
			degree: 'Прикладной бакалавр',
			form: 'Очная',
			speciality: '44.03.01 - Педагогическое образование',
			grade: '4',
			group: '10',
		}],
	}];
	const anotherStudent = 	{
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
	};
	switch (conf.testCase) {
		case '1': soapResponseStudents.push(anotherStudent);
			break;
		case '2': soapResponseStudents[0].recordBooks.push({
			externalID: 'ДО-ММ-21-0347',
			planExternalID: '000152378',
			facultyExternalID: '000001387',
			status: 'Учится',
			degree: 'Дополнительная общеразвивающая программа',
			form: 'Очная',
			speciality: '02.00.01 - Информатика. Пользователь компьютера плюс',
			grade: '1',
			group: '45',
		});
			break;
		case '3': soapResponseStudents[1].recordBooks[0].grade = '1';
			break;
		default: break;
	}
	return Promise.resolve(soapResponseStudents);
};

module.exports = getStudents;
