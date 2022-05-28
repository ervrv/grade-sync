const logger = require('../../lib/logger');
const Sync = require('../../model/sync');
const SyncLog = require('../../model/sync-log');
const Soap = require('../../model/soap');
const Grade = require('../../model/grade');
const FinalFormsLogs = require('../../model/final_forms');
const shortenText = require('./utils').shortenText;

const router = require('express')
	.Router();

const conf = require('../../conf');

const allowedFaculties = ['24'];
const allowedGrades = ['5'];

// const allowedPlans = ['000143995', '000143621', '000143088', '000143087'];

const adminAccounts = ['6847', '1', '41212', '60', '24440', '41190', '3996', '47360'];

let isSemesterFormAllowed = function(year, semester, faculty, gradenum, accountid, plan) {
	if (adminAccounts.includes(accountid)) {
		return true;
	}
	year = parseInt(year.substr(0,4), 10);
	if (year >= 2020) {
		//return (semester == 2) || (allowedFaculties.includes(faculty) && allowedGrades.includes(gradenum));
		//return (semester == 2);
		//return (semester === '2') || (allowedPlans.includes(plan));
		return true;
	}
	else if (year === 2019) {
		return (semester === '2');
	}
	else {
		return false;
	}
};

let getSuitableDate = function(year, semester){
	year = parseInt(year.substr(0,4), 10);
	currentDate = new Date();
	year += 1;
	if(semester == 2) {
		endOfSummer =  new Date(year, 6, 20, 0,0,0,0);
		if (currentDate > endOfSummer) {
			currentDate = endOfSummer;
		}
	} else {
		endOfWinter = new Date(year, 0, 31, 0,0,0,0);
		if (currentDate > endOfWinter) {
			currentDate = endOfWinter;
		}
	}
	return currentDate;
};


let processSOAPMessage = function(message) {
	if (typeof message === 'object') {
		if (message instanceof Array) {
			return message;
		} else if (typeof message.Errors.Error[1] !== 'undefined') {
				text = message.Errors.Error[1]['faultstring'];
				if (typeof text === 'undefined') {
					text = message.Errors.Error[1]['Description'];
					message.Errors.Error[1]['Description'] = shortenText(text);
				} else {
					message.Errors.Error[1]['faultstring'] = shortenText(text);
				}
		}
	}
	return message;
}

router.get('/', async (req, res, next) => {
	try {
		const {
			accountid,
			year,
			semester,
			plan,
			disciplineID,
			discipline,
			groupnum,
			groupid,
			gradenum,
			faculty,
			study_form,
			milestone,
		} = req.query;

		let result = null;
		let xmlRequest = null;
		let jsonRequest = null;
		let soapResponse = null;
		//const dateStr = new Date().toISOString(); //.replace('Z', '+03.00');
		const dateStr = getSuitableDate(year, semester).toISOString();
		try {
			logger.info({
				content: {
					accountid: accountid,
					studyPlan: plan,
					formYear: year,
					formSemester: semester,
					formDisciplineID: disciplineID,
					formDiscipline: discipline,
					formGroup: groupnum,
					formGroupID: groupid,
					formGrade: gradenum,
					formFaculty: faculty,
					formStudyForm: study_form,
					formMilestone: milestone,
					timestamp: dateStr,
					type: 'forms',
				}},'START', 'Sync forms');

			if (! isSemesterFormAllowed(year, semester, faculty, gradenum, accountid, plan)) {
				result = {
					'Errors': {
						'Error': [
							{
								'faultcode': 'grade:error',
							},
							{
								'faultstring': 'Выгрузка ведомостей этого семестра или курса заблокирована',
							},
							{
								'detail': '',
							}
						]
					}
				};
				res.api.response(result);
				return;
			}


			// await SyncLog.write('plans', faculty.id, 'soap response', plans);
			const gradeResponse = await Grade.getForms(accountid, year.substring(0, 4), semester, plan, disciplineID, discipline, groupnum, groupid, gradenum, faculty, study_form, milestone);
			jsonRequest = gradeResponse;
			// logger.info({content: {
			// 			  	data: gradeResponse,
			// 			 }}, 'DONE', 'Sync getForms', );
			if (typeof gradeResponse === 'undefined') {
				result = {
					'Errors': {
						'Error': [
							{
								'faultcode': 'grade:error'
							},
							{
								'faultstring': 'Неожиданная ошибка'
							},
							{
								'detail': ''
							}
						]
					}
				};
			} else if (typeof gradeResponse === 'object') {
				if (typeof gradeResponse.code !== 'undefined') {
					result = {
						'Errors': {
							'Error': [
								{
									'faultcode': 'grade:error'
								},
								{
									'faultstring': gradeResponse.message
								},
								{
									'detail': ''
								}
							]
						}
					};
				} else {
					if (gradeResponse.response.body === undefined || (gradeResponse.response.body.length !== undefined && gradeResponse.response.body.length === 0)) {
						result = {
							'Errors': {
								'Error': [
									{
										'faultcode': 'grade:error'
									},
									{
										'faultstring': 'Пустая ведомость (нет студентов или оценок)'
									},
									{
										'detail': ''
									}
								]
							}
						};
						res.api.response(result);
						return;
					}
					else if (! conf.params.emulateExportForms) {
						xmlRequest = await Soap.getFormUploadXML(year, semester, dateStr, gradeResponse, milestone, disciplineID, groupnum);
						result = await Soap.uploadForms(year, semester, dateStr, gradeResponse, milestone, disciplineID, groupnum);
						soapResponse = result;
					} else {
						result = {
							'Errors': ''
						};
					}
				}
			} else {
				result = {
					'Errors': {
						'Error': [
							{
								'faultcode': 'grade:error'
							},
							{
								'faultstring': gradeResponse
							},
							{
								'detail': ''
							}
						]
					}
				};
			}

			logger.info({content: {
				studyPlan: plan,
				formYear: year,
				formSemester: semester,
				formDisciplineID: disciplineID,
				formDiscipline: discipline,
				formGroup: groupnum,
				formGroupID: groupid,
				formGrade: gradenum,
				formFaculty: faculty,
				formStudyForm: study_form,
				timestamp: dateStr,
				type: 'forms',
			}}, 'DONE', 'Sync forms');
		} catch (err) {
			await SyncLog.write('forms', null, 'error', err);
			logger.error(err);
		} finally {
			await FinalFormsLogs.write(disciplineID, groupid, xmlRequest, jsonRequest, soapResponse, year, semester, milestone, plan, faculty);
		}
		result = processSOAPMessage(result);
		res.api.response(result);
	} catch (err) {
		next(err);
	}
});

router.get('/request', async (req, res, next) => {
	try {
		const {
			accountid,
			year,
			semester,
			plan,
			disciplineID,
			discipline,
			groupnum,
			groupid,
			gradenum,
			faculty,
			study_form,
			milestone
		} = req.query;

		//const dateStr = new Date().toISOString();
		const dateStr = getSuitableDate(year, semester).toISOString();
		let xmlResult = '';
		try {
			logger.info({content: {
				accountid: accountid,
				studyPlan: plan,
				formYear: year,
				formSemester: semester,
				formDisciplineID: disciplineID,
				formDiscipline: discipline,
				formGroup: groupnum,
				formGroupID: groupid,
				formGrade: gradenum,
				formFaculty: faculty,
				formStudyForm: study_form,
				formMilestone: milestone,
				timestamp: dateStr,
				type: 'forms',
			}}, 'START', 'Sync forms get request');
			// await SyncLog.write('plans', faculty.id, 'soap response', plans);
			const gradeResponse = await Grade.getForms(accountid, year.substring(0, 4), semester, plan, disciplineID, discipline, groupnum, groupid, gradenum, faculty, study_form, milestone, true);
			// logger.info({content: {
			// 			  	data: gradeResponse,
			// 			}}, 'DONE', 'Sync getForms', );
			xmlResult = await Soap.getFormUploadXML(year, semester, dateStr, gradeResponse, milestone, disciplineID, groupnum);

			// await SyncLog.write('plans', faculty.id, 'grade response', gradeResponse);

			logger.info({content: {
				studyPlan: plan,
				formYear: year,
				formSemester: semester,
				formDisciplineID: disciplineID,
				formDiscipline: discipline,
				formGroup: groupnum,
				formGroupID: groupid,
				formGrade: gradenum,
				formFaculty: faculty,
				formStudyForm: study_form,
				timestamp: dateStr,
				type: 'forms',
			}}, 'DONE', 'Sync forms get request');
		} catch (err) {
			await SyncLog.write('forms', null, 'error', err);
			logger.error(err);
		}

		res.set('Content-Type', 'text/xml');
		res.send(xmlResult);
	} catch (err) {
		next(err);
	}
});

router.get('/repeat', async (req, res, next) => {
	try {
		const {
			dateFrom,
			dateTo,
			faculty,
			year,
			semester,
			groupid,
			planid,
			milestone,
			dryRun,
		} = req.query;


		let from = new Date(Date.parse(dateFrom));
		let to = new Date(Date.parse(dateTo));
		let query = {
			exportDate: {
				$gte: from,
				$lte: to,
				//$gte: new Date(2020, 11,1),
				//$lte: new Date(2020, 11,27),
				$ne: null,
			},
		};
		if (faculty) {
			query.faculty = { $eq: faculty };
		}
		if (year) {
			query.year = { $eq: year };
		}
		if (semester) {
			query.semester = { $eq: semester };
		}
		if (groupid) {
			query.groupID = { $eq: groupid };
		}
		if (milestone) {
			query.milestone = { $eq: milestone };
		}
		if (planid) {
			query.studyPlan = { $eq: planid };
		}

		try {
			logger.info({content: query}, 'START', 'Sync forms repeat');


			const formsCursor = FinalFormsLogs.find(query).sort({
				exportDate: 1,
			}).cursor().addCursorFlag('noCursorTimeout',true);

			await formsCursor.eachAsync(async (form) => {
				const xmlText = form.requestXML;
				console.log('form exported at: ', form.exportDate);
				console.log(dryRun);
				if (dryRun === "true") {
				} else {
					await Soap.uploadXML(xmlText, form.requestJSON);
				}
			});

			logger.info({content: {
				dateFrom: dateFrom,
				dateTo: dateTo,
				type: 'forms',
			}}, 'DONE', 'Sync forms get request', );
		} catch (err) {
			logger.error(err);
		}

		res.set('Content-Type', 'text/xml');
		res.send("");
	} catch (err) {
		next(err);
	}
});

module.exports = router;
