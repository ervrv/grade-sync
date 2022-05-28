const plans = require('./syncPlans');
const router = require('express').Router();

router.get('/mongo', async (req, res, next) => {
	try {
		const { enableDismissed } = req.query;
		await plans.syncPlansMongo(enableDismissed);
		res.api.response();
	} catch (err) {
		next(err);
	}
});

router.get('/grade', async (req, res, next) => {
	try {
		await plans.syncPlansGrade();
		res.api.response();
	} catch (err) {
		next(err);
	}
});

module.exports = router;

