const logger = require('../../lib/logger');

const SyncLog = require('../../model/sync-log');
const Grade = require('../../model/grade');
const SyncData = require('../../model/sync-data');

const router = require('express').Router();

router.get('/', async (req, res, next) => {
	try {
		const syncDataCursor = SyncData.find({
			completed: false,
		}).cursor();

		await syncDataCursor.eachAsync(async (sync) => {
			const faculty = await sync.faculty();
			const syncType = sync.type;
			const soapLastDate = sync.soapLastDate();
			const syncParams = sync.params;

			try {
				const syncName = 'Sync '.concat(syncType);
				logger.info({content: {
					faculty: faculty.externalID,
					timestamp: soapLastDate,
					type: 'sync',
				}}, 'START', syncName);

				let gradeResponse = null;
				switch (syncType) {
					case 'plans': {
						gradeResponse = await Grade.putPlans(faculty.externalID, syncParams.year, syncParams.semester, sync.content)
						break;
					}
					case 'teachers': {
						gradeResponse = await Grade.putTeachers(faculty.externalID, sync.content);
						break;
					}
					case 'students': {
						gradeResponse = await Grade.putStudents(faculty.externalID, sync.content);
						break;
					}
					default: {
						throw new Error('неожиданный тип синхронизации в sync_db');
					}
				}
				await SyncLog.write(syncType, faculty.id, 'grade response', gradeResponse);

				logger.info({content: {
					faculty: faculty.externalID,
					timestamp: soapLastDate,
					type: 'sync',
				}}, 'DONE', syncName);

				if (typeof(gradeResponse) === 'object') {
					sync.completed = true;
				}
				// sync.lastDate = Date.now();
				await sync.save();
			} catch (err) {
				await SyncLog.write(syncType, faculty.id, 'error', err);
				logger.error(err);
			}
		});

		res.api.response();
	} catch (err) {
		next(err);
	}
});

module.exports = router;
