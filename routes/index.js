const bridges = require('./bridges');
const apiRoute = require('./api');


const router = require('express').Router();

router.use(
	bridges.noCache,
	apiRoute,
	bridges.notFound,
	bridges.apiError,
);


module.exports = router;
