module.exports = {
	env: {
		port: 3005,
		mode: 'production',
	},
	mongo: {
		url: 'mongodb://localhost:27021/grade-sync',
		test_url: 'mongodb://localhost:27011/grade-sync',
		needAuth: false,
		user: 'root',
		pass: 'Pefnesdy',
	},
	scud: {
		server: 'test',
		// 'server': '127.0.0.1',
		authentication: {
			type: 'default',
			options: {
				userName: '#######',
				password: '#######',
			},
		},
		options: {
			port: 1433,
			// 'port': 1435,
			database: 'SCUDData',
			trustServerCertificate: true,
			rowCollectionOnDone: true,
			rowCollectionOnRequestCompletion: true,
		},
	},

	office: {
		url: 'http://test',
		muam_url: 'http://test',
		phiz_url: 'http://test',
	},
	soap: {
		params: {
			host: 'localhost:8088',
			path: '/mockBRSSoapBinding',
			wsdl: '/mockBRSSoapBinding?wsdl',
			headers: {
				// eslint-disable-next-line no-useless-concat
				Authorization: `Basic ${Buffer.from('USERNAME' + ':' + 'PASSWORD').toString('base64')}`,
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
		url: 'https://59254e08-794c-4693-8fff-8d3d1c8599aa.mock.pstmn.io',
		token: 'a4c0b662d23cb418c60c641b2a3b22f83a0c66e5',
		semester: 1,
		year: 2018,
	},
	testCase: null,
};
