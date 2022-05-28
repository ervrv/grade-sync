const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');

module.exports = {
	async putPlans(faculty, year, semester, plans, useDate = false, studyForm = '1') {
		let dumpPath = '';
		let dumpName = faculty;
		if (studyForm === '2') {
			dumpName += '_во';
		}
		if (studyForm === '3') {
			dumpName += '_зо';
		}
		if (useDate) {
			dumpPath = `dump/${moment()
				.format('YYYY-MM-DD')}/${moment()
				.format('YYYY-MM-DD_HH-mm-ss')}_plans_${dumpName}.json`;
		} else {
			dumpPath = `dump/data/plans_${dumpName}.json`;
		}

		await fs.mkdirp(path.dirname(dumpPath));
		await fs.writeFile(dumpPath, JSON.stringify({
			faculty,
			year,
			semester,
			plans,
		}, null, 4));
	},

	async putStudents(faculty, students, useDate = false) {
		let dumpPath = '';
		if (useDate) {
			dumpPath = `dump/${moment()
				.format('YYYY-MM-DD')}/${moment()
				.format('YYYY-MM-DD_HH-mm-ss')}_students_${faculty}.json`;
		} else {
			dumpPath = `dump/data/students_${faculty}.json`;
		}

		await fs.mkdirp(path.dirname(dumpPath));
		await fs.writeFile(dumpPath, JSON.stringify({
			faculty,
			students,
		}, null, 4));
	},

	async putTeachers(faculty, teachers, useDate = false) {
		let dumpPath = '';
		if (useDate) {
			dumpPath = `dump/${moment()
				.format('YYYY-MM-DD')}/${moment()
				.format('YYYY-MM-DD_HH-mm-ss')}_teachers_${faculty}.json`;
		} else {
			dumpPath = `dump/data/teachers_${faculty}.json`;
		}

		await fs.mkdirp(path.dirname(dumpPath));
		await fs.writeFile(dumpPath, JSON.stringify({
			faculty,
			teachers,
		}, null, 4));
	},
};

