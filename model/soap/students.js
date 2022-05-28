const soap = require('../../lib/soap');


function processRecordBook(soapRecordBook) {
	return {
		externalID: soapRecordBook.id,
		planExternalID: soapRecordBook.planId,
		facultyExternalID: soapRecordBook.subdivision,
		status: soapRecordBook.status,
		degree: soapRecordBook.level,
		form: soapRecordBook.form,
		speciality: soapRecordBook.speciality,
		grade: soapRecordBook.grade,
		group: soapRecordBook.group,
	};
}

function processStudent(soapStudent) {
	return {
		externalID: soapStudent.id,
		firstName: soapStudent.firstName,
		secondName: soapStudent.secondName,
		lastName: soapStudent.lastName,
		recordBooks: soap.processArray(soapStudent.recordBooks, 'recordBook', processRecordBook),
	};
}

function processResponse(soapResponse) {
	const response = soap.getObject(soapResponse);

	const errors = response.Errors;
	if (errors) {
		throw errors;
	}

	return soap.processArray(response.students, 'Student', processStudent);
}


module.exports = async (subdivision, dismissed, timestamp) => {
	const soapResponse = await soap.call('GetStudents', {
		subdivision,
		dismissed,
		timestamp,
	});
	return processResponse(soapResponse);
};
