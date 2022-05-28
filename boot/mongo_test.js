const Promise = require('bluebird');
const mongoose = require('mongoose');
const conf = require('../conf');

module.exports = async () => {
	mongoose.Promise = Promise;
	await mongoose.connect(conf.mongo.test_url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		poolSize: 10,
	});
};
