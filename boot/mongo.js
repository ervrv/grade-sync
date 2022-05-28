const Promise = require('bluebird');
const mongoose = require('mongoose');

const conf = require('../conf');
const logger = require('../lib/logger');

const options = {
	user: conf.mongo.user,
	pass: conf.mongo.pass,
};

module.exports = () => {
	mongoose.Promise = Promise;
	if (conf.mongo.needAuth) {
		mongoose.connect(conf.mongo.url, options, (err) => {
			if (err) {
				logger.error(err);
				process.exit(1);
			}
		});
	} else {
		mongoose.connect(conf.mongo.url, (err) => {
			if (err) {
				logger.error(err);
				process.exit(1);
			}
		});
	}
};
