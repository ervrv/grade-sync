const soap = require('../../lib/soap');


function processSubdivision(soapSubdivision) {
	return {
		externalID: soapSubdivision.id,
		name: soapSubdivision.name,
		parentExternalID: soapSubdivision.parentId,
	};
}

function processResponse(soapResponse) {
	const response = soap.getObject(soapResponse);

	const errors = response.Errors;
	if (errors) {
		throw errors;
	}

	return soap.processArray(response.Subdivisions, 'Subdivision', processSubdivision);
}


module.exports = async () => {
	const soapResponse = await soap.call('GetSubdivisions', {});
	return processResponse(soapResponse);
};
