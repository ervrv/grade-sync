const students = require('./syncStudents');
const router = require('express').Router();

router.get('/mongo', async (req, res, next) => {
	try {
		const { enableDismissed } = req.query;
		await students.syncStudentsMongo(enableDismissed);
		res.api.response();
	} catch (err) {
		next(err);
	}
});

router.get('/grade', async (req, res, next) => {
	try {
		await students.syncStudentsGrade();
		res.api.response();
	} catch (err) {
		next(err);
	}
});

module.exports = router;

