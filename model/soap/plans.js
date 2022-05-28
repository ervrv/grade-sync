const soap = require('../../lib/soap');


function processDiscipline(soapDiscipline) {
	return {
		externalID: soapDiscipline.id,
		name: soapDiscipline.name,
		type: soapDiscipline.type,
		global: soapDiscipline.global,
		teachers: soap.processArray(soapDiscipline.teachers, 'teacher'),
		course: soapDiscipline.course,
		grade: soapDiscipline.grade,
		year: soapDiscipline.year.substr(0, 4),
		semester: soapDiscipline.semester,
	};
}

function processPlan(soapPlan) {
	return {
		externalID: soapPlan.planId,
		learningPlanExtID: soapPlan.studyPlanId,
		disciplines: soap.processArray(soapPlan.disciplines, 'discipline', processDiscipline),
	};
}

function processResponse(soapResponse) {
	const response = soap.getObject(soapResponse);

	const errors = response.Errors;
	if (errors) {
		throw errors;
	}

	return soap.processArray(response.plans, 'plan', processPlan);
}


module.exports = async (subdivision, year, semester, eduForm, timestamp) => {
	const soapResponse = await soap.call('GetDisciplines', {
		Parameters: {
			year,
			semester,
			subdivision,
			timestamp,
			eduForm,
		},
	});
	return processResponse(soapResponse);
};
