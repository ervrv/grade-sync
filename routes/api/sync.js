const Faculty = require('../../model/faculty');
const Sync = require('../../model/sync');


const router = require('express').Router();


router.get('/enable', async (req, res, next) => {
	try {
		const { faculty: externalID, type, lastDate } = req.query;

		const faculty = await Faculty.findOne({ externalID });

		let sync = await Sync.findOne({
			facultyID: faculty.id,
			type,
		});
		if (! sync) {
			sync = new Sync({
				facultyID: faculty.id,
				type,
			});
		}

		if (lastDate) {
			sync.lastDate = new Date(lastDate);
		}
		sync.enabled = true;
		await sync.save();

		res.api.response();
	} catch (err) {
		next(err);
	}
});


router.get('/disable', async (req, res, next) => {
	try {
		const { faculty: externalID, type } = req.query;

		const faculty = await Faculty.findOne({ externalID });

		const sync = await Sync.findOne({
			facultyID: faculty.id,
			type,
		});

		sync.enabled = false;
		await sync.save();

		res.api.response();
	} catch (err) {
		next(err);
	}
});


module.exports = router;
