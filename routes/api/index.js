const facultiesRoute = require('./faculties');
const plansRoute = require('./plans');
const globalDisciplinesRoute = require('./globalDisciplines');
const syncRoute = require('./sync');
const syncDbRoute = require('./sync-db');
const studentsRoute = require('./students');
const teachersRoute = require('./teachers');
const logsRoute = require('./logs');
const sportAttendanceRoute = require('./sport_attendance');
const formsRoute = require('./forms');
const syncLogsRoute = require('./syncLogs');

const router = require('express').Router();

router.use(
	'/faculties',
	facultiesRoute,
);


router.use(
	'/plans',
	plansRoute,
);

router.use(
	'/globalDisciplines',
	globalDisciplinesRoute,
);

router.use(
	'/sync',
	syncRoute,
);

router.use(
	'/sync-db',
	syncDbRoute,
);


router.use(
	'/students',
	studentsRoute,
);


router.use(
	'/teachers',
	teachersRoute,
);

router.use(
	'/logs',
	logsRoute,
);

router.use(
	'/sport_attendance',
	sportAttendanceRoute,
);

router.use(
	'/forms',
	formsRoute,
);

router.use(
	'/syncLogs',
	syncLogsRoute,
);

module.exports = router;
