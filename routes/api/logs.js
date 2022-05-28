const logger = require('../../lib/logger');
const SyncLog = require('../../model/sync-log');

const router = require('express').Router();


router.get('/', async (req, res, next) => {
	try {
		const syncLogCursor = SyncLog.find({}).cursor();
		const logs = [];

		await syncLogCursor.eachAsync(async (syncLog) => {
			const successful = typeof(syncLog.content) === 'object';
			const logLine = {
				timestamp: syncLog.date,
				success: successful,
				type: syncLog.type,
				message: syncLog.message,
				content: successful ? null : syncLog.content,
			};
			logs.push(logLine);
		});
		res.json(logs);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
