const teachers = require('./syncTeachers');
const router = require('express').Router();

router.get('/mongo', async (req, res, next) => {
	try {
		const { enableDismissed } = req.query;
		await teachers.syncTeachersMongo(enableDismissed);
		res.api.response();
	} catch (err) {
		next(err);
	}
});

router.get('/grade', async (req, res, next) => {
	// const { facultyID } = req.query;
	try {
		await teachers.syncTeachersGrade(); // facultyID);
		res.api.response();
	} catch (err) {
		next(err);
	}
});

module.exports = router;

