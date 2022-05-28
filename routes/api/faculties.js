const Promise = require('bluebird');

const Faculty = require('../../model/faculty');
const Soap = require('../../model/soap');

const Sync = require('../../model/sync');
const logger = require('../../lib/logger');
const moment = require("moment");

const lastDate = '2018-10-23T17:00:00.000+0000';
const teachersStartDate = '2000-06-30T20:00:00.000+0000';
const plansStudentsStartDate = '2015-05-30T06:00:00.000+0000';

const router = require('express').Router();

router.get('/add', async (req, res, next) => {
	try {
		//const subdisions = await Soap.getSubdivisions();
		// subdisions.push({
		// 	"externalID": "000007903",
		// 	"name": "Иберо-Американское отделение",
		// 	"parentExternalID": ""
		// });

		const { externalID, name } = req.query;

		let faculty = await Faculty.findOne({ externalID });
		if (! faculty) {
			faculty = new Faculty({ externalID });
		} else {
			throw new Error("Faculty already exists!");
		}

		faculty.name = name;
		await faculty.save();

		const facultiesCursor = Faculty.find({externalID}).cursor();
		await facultiesCursor.eachAsync(async (faculty) => {
			try {

				logger.info({content: {
					faculty: faculty.externalID,
					type: 'faculties',
				}}, 'START', 'init syncs');

				Sync.write(
					'teachers',
					faculty.id,
					//lastDate,
					teachersStartDate,
					true,
				);
				Sync.write(
					'plans',
					faculty.id,
					//lastDate,
					plansStudentsStartDate,
					true,
				);
				Sync.write(
					'students',
					faculty.id,
					//lastDate,
					plansStudentsStartDate,
					true,
				);
			} catch (err) {
				logger.error(err);
			}
		});

		res.api.response();
	} catch (err) {
		next(err);
	}
});


router.get('/self', async (req, res, next) => {
	await a.save();
	try {
		const subdisions = await Soap.getSubdivisions();
		// subdisions.push({
		// 	"externalID": "000007903",
		// 	"name": "Иберо-Американское отделение",
		// 	"parentExternalID": ""
		// });
		const faculties = subdisions.filter(subdision => ! subdision.parentExternalID || subdision.name === 'Институт высоких технологий и пьезотехники');

		await Promise.each(faculties, async ({ externalID, name }) => {
			let faculty = await Faculty.findOne({ externalID });
			if (! faculty) {
				faculty = new Faculty({ externalID });
			}

			faculty.name = name;
			await faculty.save();
		});

		res.api.response();
	} catch (err) {
		next(err);
	}
});


module.exports = router;
