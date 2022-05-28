const logger = require('../lib/logger');


module.exports = {
	noCache(req, res, next) {
		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
		res.header('Expires', '-1');
		res.header('Pragma', 'no-cache');
		next();
	},

	notFound(req, res, next) {
		const err = new Error('Not Found');
		err.status = 404;
		next(err);
	},

	// eslint-disable-next-line no-unused-vars
	apiError(err, req, res, next) {
		logger.error(err);

		res.api.error(err);
	},
};
