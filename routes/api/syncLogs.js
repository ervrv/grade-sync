const Grade = require('../../model/grade');

const router = require('express').Router();

router.get('/', async (req, res, next) => {
	try {
		await Grade.logSync();
		res.api.response();
	} catch (err) {
		next(err);
	}
});

module.exports = router;
