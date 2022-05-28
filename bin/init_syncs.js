#!/usr/bin/env node

require('../boot/mongo')();
const Faculties = require('../model/faculty');
const Sync = require('../model/sync');
const logger = require('../lib/logger');

const lastDate = '2018-10-23T17:00:00.000+0000';
const teachersStartDate = '2000-06-30T20:00:00.000+0000';
const plansStudentsStartDate = '2015-05-30T06:00:00.000+0000';

// var debug = require('debug')('aesthetics-demo:server');
// use as node /bin/init_sync.js

const enabledFaculties = require('../conf/enabled_faculties');

const isFacultyEnabled = function (facultyExternalID) {
	return enabledFaculties.facultyList.some(e => e.id === facultyExternalID);
};

const initSyncs = async function () {
	const facultiesCursor = Faculties.find({}).cursor();
	await Sync.collection.remove();
	await facultiesCursor.eachAsync(async (faculty) => {
		try {
			const enabled = isFacultyEnabled(faculty.externalID);
			if (enabled) {
				logger.info({content: {
					faculty: faculty.externalID,
					type: 'internal',
				}}, 'START', 'init syncs');
			} else {
				return;
			}
			Sync.write(
				'teachers',
				faculty.id,
				//lastDate,
				teachersStartDate,
				enabled,
			);
			Sync.write(
				'plans',
				faculty.id,
				//lastDate,
				plansStudentsStartDate,
				enabled,
			);
			Sync.write(
				'students',
				faculty.id,
				//lastDate,
				plansStudentsStartDate,
				enabled,
			);
		} catch (err) {
			logger.error(err);
		}
	});
};

initSyncs();
