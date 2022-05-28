const soap = require('../../lib/soap');


function processTeacher(soapTeacher) {
	return {
		externalID: soapTeacher.id,
		inila: soapTeacher.hashSnils,
		firstName: soapTeacher.firstName,
		secondName: soapTeacher.secondName,
		lastName: soapTeacher.lastName,
		jobPositionName: soapTeacher.position,
		status: soapTeacher.status,
	};
}

function processDepartment(soapDepartment) {
	return {
		externalID: soapDepartment.id,
		teachers: soap.processArray(soapDepartment.teachers, 'teacher', processTeacher),
	};
}

function processResponse(soapResponse) {
	const response = soap.getObject(soapResponse);

	const errors = response.Errors;
	if (errors) {
		throw errors;
	}

	const departments = soap.processArray(response.departments, 'department', processDepartment);

	return [].concat(...departments.map(department => department.teachers.map((teacher) => {
		teacher.departmentExternalID = department.externalID;
		return teacher;
	})));
}


module.exports = async (subdivision, dismissed, timestamp) => {
	const soapResponse = await soap.call('GetTeachers', {
		subdivision,
		dismissed,
		timestamp,
	});
	return processResponse(soapResponse);
};
