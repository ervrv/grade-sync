module.exports = {
	env: {
		port: 3005,
		mode: 'production',
	},
	mongo: {
		url: 'mongodb://mongo:27017/grade-sync',
		needAuth: false,
		user: 'root',
		pass: 'Pefnesdy',
	},


	scud: {
		'server': 'dbms08-s.ad.sfedu.ru',
		//'server': '127.0.0.1',
		'authentication': {
			'type': 'default',
			'options': {
				'userName': '#######',
				'password': '#######',
			}
		},
		'options': {
			'port': 1433,
			//'port': 1435,
			'database': 'SCUDData',
			'trustServerCertificate': true,
			'rowCollectionOnDone': true,
			'rowCollectionOnRequestCompletion': true,
		},
	},

	office: {
		url: 'http://flanguages.sfedu-ws.r61.net/export-brs',
		muam_url: 'http://muam.sfedu-ws.r61.net/export-brs',
		phiz_url: 'http://fizkultura.sfedu-ws.r61.net/export-brs',
	},

	soap: {
		params: {
			host: 'http://1c-new.r61.net',
			path: '/Prof/brs.1cws',
			wsdl: '/Prof/brs.1cws?wsdl',

			// host: 'http://1c-new.r61.net/Edu',
			// path: '/brs.1cws',
			// wsdl: '/brs.1cws?wsdl',

			headers: {
				'Authorization': 'Basic ' + new Buffer('USERNAME' + ':' + 'PASSWORD').toString('base64'),
				'user-agent': 'GradeSoapClient',
				'Content-Type': 'text/plain;charset=UTF-8',
			},
		},

		attributes: {
			xmlns: 'http://performance.sfedu.ru',
		},
	},

	params: {
		saveDates: false,
		emulateExportForms: false,
	},

	grade: {
		url: 'http://grade/~dev_rating/',
		//url: 'http://testgrade.sfedu.ru',
		token: 'a4c0b662d23cb418c60c641b2a3b22f83a0c66e5',
		semester: 2,
		year: 2020,
	},
};
