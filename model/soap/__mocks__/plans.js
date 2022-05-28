const Promise = require('bluebird');
const conf = require('../../../conf/app_config');

const getPlans = async function () {
	const soapResponsePlans = [{
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
		],
	}, {
		externalID: '000146246',
		learningPlanExtID: '000146245',
		disciplines: [
			{
				externalID: '000051837',
				name: 'Research Work (Научно-исследовательская работа)',
				type: 'Зачет',
				global: '0',
				teachers: [{ hashSnils: '51E2BC32883FCAB2425D1C76D4B826CE3EEBE8CA' }],
				course: '1',
				grade: 'Магистратура',
				year: '2021',
				semester: '1',
			},
			{
				externalID: '000051837',
				name: 'Research Work (Научно-исследовательская работа)',
				type: 'Прочая практика',
				global: '0',
				teachers: [{ hashSnils: '51E2BC32883FCAB2425D1C76D4B826CE3EEBE8CA' },
				],
				course: '1',
				grade: 'Магистратура',
				year: '2021',
				semester: '1',
			},
		],
	}, {
		externalID: '000134324',
		learningPlanExtID: '000130982',
		disciplines: [
			{
				externalID: '000045932',
				name: 'Модуль специальных дисциплин, включающий дисциплины профиля (Математика)',
				type: 'Зачет',
				global: '0',
				teachers: [{ hashSnils: '' }],
				course: '4',
				grade: 'Бакалавриат',
				year: '2021',
				semester: '1',
			},
			{
				externalID: '000000733',
				name: 'Элементарная математика',
				type: 'Зачет',
				global: '0',
				teachers: [{ hashSnils: '7C14FE4FD8DC31791894243DE9A76E0213974648' }],
				course: '4',
				grade: 'Бакалавриат',
				year: '2021',
				semester: '1',
			},
			{
				externalID: '000001949',
				name: 'Дополнительные главы математического анализа',
				type: 'Зачет',
				global: '0',
				teachers: [{ hashSnils: '2B97D6D7000D9AF6F75FC65A16AAEB1C43054110' }],
				course: '4',
				grade: 'Бакалавриат',
				year: '2021',
				semester: '1',
			},
		],
	}];

	switch (conf.testCase) {
		case '1': soapResponsePlans[0].disciplines.push({
			externalID: '000055047',
			name: 'Research Work (Научно-исследовательская работа)',
			type: 'Зачет',
			global: '0',
			teachers: [{ hashSnils: 'A672CB69245A8FDF4548FA50B10D2DC14DF90A96' }],
			course: '1',
			grade: 'Магистратура',
			year: '2021',
			semester: '2',
		});
			break;
		case '2': soapResponsePlans[0].disciplines[0].teachers = [{ hashSnils: 'A672CB69245A8FDF4548FA50B10D2DC14DF90A96' }];
			break;
		case '3': soapResponsePlans[0].disciplines[0].teachers = [{ hashSnils: '' }];
			soapResponsePlans[0].disciplines[0].semester = '2';
			break;
		default: break;
	}
	return Promise.resolve(soapResponsePlans);
};

module.exports = getPlans;

