const Promise = require('bluebird');
const conf = require('../../../conf/app_config');

const getTeachers = async function () {
	const soapResponseTeachers = [{
		departmentExternalID: '000001101',
		externalID: '000073199',
		firstName: 'Татьяна',
		secondName: 'Алексеевна',
		lastName: 'Бутко',
		status: 'Работает',
		jobPositionName: 'Лаборант',
		inila: '04B59431E08F81534BDDFC4995ABC02D149134BD',
	}, {
		departmentExternalID: '000000517',
		externalID: '000035835',
		firstName: 'Ксения',
		secondName: 'Ивановна',
		lastName: 'Мисюра',
		status: 'Работает',
		jobPositionName: 'Ассистент',
		inila: '24EE82FC34B2B984B0256AA7D81427E1D058DA2E',
	}, {
		departmentExternalID: '000001099',
		externalID: '000011602',
		firstName: 'Олег',
		secondName: 'Геннадиевич',
		lastName: 'Авсянкин',
		status: 'Работает',
		jobPositionName: 'Профессор',
		inila: 'F0E5D8C157FB346ED9183F4AC5B0D1255E275936',
	}, {
		departmentExternalID: '000001099',
		externalID: '000011673',
		firstName: 'Борис',
		secondName: 'Григорьевич',
		lastName: 'Вакулов',
		status: 'Работает',
		jobPositionName: 'Доцент',
		inila: 'CF000382A45BE7B499901E1C2FF09FD78D6BECC7',
	}, {
		departmentExternalID: '000001099',
		externalID: '000072505',
		firstName: 'Раиса',
		secondName: 'Макаровна',
		lastName: 'Гаврилова',
		status: 'Работает',
		jobPositionName: 'Доцент',
		inila: '606A09BAF7357315FEA1EFE8C8536095041B29C3',
	}];
	const anotherTeacher = {
		departmentExternalID: '000001387',
		externalID: '000072474',
		firstName: 'Анна',
		secondName: 'Владимировна',
		lastName: 'Абрамян',
		status: 'Работает',
		jobPositionName: 'Доцент',
		inila: 'D8EE6595B33943CB102BC0AF5143F130008AE820',
	};
	switch (conf.testCase) {
		case '1': soapResponseTeachers[0].jobPositionName = 'Ассистент';
			break;
		case '2':
			soapResponseTeachers[0].jobPositionName = 'Ассистент';
			soapResponseTeachers.push(anotherTeacher);
			soapResponseTeachers.push(anotherTeacher);
			break;
		case '3': soapResponseTeachers[0] = {
			departmentExternalID: '123456789',
			externalID: '000073199',
			firstName: 'Дарья',
			secondName: 'Вячеславовна',
			lastName: 'Иваницкая',
			status: 'Играет',
			jobPositionName: 'Отчилена',
			inila: '04B59431E00D7B534BDDFC4995ABF4GD149134BD',
		};
			break;
		default: break;
	}
	return Promise.resolve(soapResponseTeachers);
};

module.exports = getTeachers;
