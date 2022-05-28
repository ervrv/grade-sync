const bunyan = require('bunyan');
const conf = require('../conf');
const logMongoModel = require('../model/logs');

var logEntryStream = require('bunyan-mongodb-stream')({ model: logMongoModel });

//const isDevelopment = process.env.NODE_ENV !== 'production';
const isDevelopment = conf.env.mode !== 'production';

if (isDevelopment) {
	module.exports = bunyan.createLogger({
		name: 'app',
		stream: process.stdout,
		level: isDevelopment ? 'debug' : 'info',
		serializers: bunyan.stdSerializers,
	})
}
else {
    // module.exports = bunyan.createLogger({
    //     name: 'app',
    //     level: 'debug',
    //     path: '/logs/logs.json'
    // })
	module.exports = bunyan.createLogger({
	    name: 'app',
	    level: 'debug',
	    streams: [
			{
				stream: logEntryStream,
			},
		],
		serializers: bunyan.stdSerializers,
	});
}
