// const soap = require('../../lib/soap');

var request = require("request");

const conf = require('../../conf');

function processResponse(officeResponse) {
	return officeResponse;

}

var officeGlobalDiscUrl = conf.office.url;
	// +
	// "?year=2018" +
	// "&semester=2

module.exports = async function (serviceUrl, year, semester, onSuccess, onError) {

	request({
		url: serviceUrl + "?year=" + year.substr(0, 4).toString() + "&semester=" + semester.toString(),
		json: true
	}, function (error, response, body) {

		if (!error && response.statusCode === 200) {
			onSuccess(processResponse(body));
		} else {
			onError(error);
		}
	});

};
