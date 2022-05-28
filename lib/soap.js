const easysoap = require('../easysoap/src/easysoap');

const conf = require('../conf');


const soapClient = easysoap.createClient(conf.soap.params);

module.exports = {
	async call(method, params) {
		// TODO: обработка ошибок SOAP
		let response = null;
		const methodResponse = await soapClient.call({
			method,
			attributes: conf.soap.attributes,
			params,
		})
			.then((callResponse) => {
				response = callResponse;
			});

		if (typeof response.data[`${method}Response`] !== 'undefined') {
			return response.data[`${method}Response`].return;
		} else if (typeof response.data['Fault'] !== 'undefined') {
			return {
				'Errors': {
					'Error': response.data['Fault'],
				},
			};
		} else {
			return response;
		}
	},

	async getRequest(method, params) {
		const request = await soapClient.getRequestXml({
			method,
			attributes: conf.soap.attributes,
			params,
		});
		return request;
	},

	getRequestAsJSON(xml) {
		return soapClient.getXmlDataAsJson(xml);
	},

	getObject(array) {
		return (array instanceof Array ? array : [array]).reduce((object, item) => {
			Object.keys(item)
				.forEach((key) => {
					object[key] = item[key];
				});

			return object;
		}, {});
	},

	processArray(array, key, callback = item => item) {
		return (array instanceof Array ? array : [array])
			.map(item => item[key])
			.map(module.exports.getObject)
			.map(callback);
	},
};
