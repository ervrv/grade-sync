const unirest = require('unirest');
const { URL } = require('url');

const conf = require('../conf');

const isDebug = conf.env.mode !== 'production';

let request_headers = {
	'Content-Type': 'application/json',
};

if (isDebug) {
	request_headers.Cookie = 'XDEBUG_SESSION=XDEBUG_ECLIPSE; Path=/; Domain=grade;';
}

module.exports = {
	async putPlans(faculty, year, semester, plans, form) {
		return new Promise(resolve => unirest.put(new URL('api/v0/studyPlan', conf.grade.url).toString())
			.headers(request_headers)
			.query({
				token: conf.grade.token,
				batch: 'json',
			})
			.type('json')
			.send({
				faculty,
				year,
				semester,
				plans,
				form,
			})
			.end(res => resolve(res.body)));
	},

	async putGlobalDisciplines(year, semester, disciplines) {
		return new Promise(resolve => unirest.put(new URL('api/v0/globalDiscipline', conf.grade.url).toString())
			.headers(request_headers)
			.query({
				token: conf.grade.token,
				batch: 'json',
				year: year,
				semester: semester,
			})
			.type('json')
			.send({
				groups: disciplines,
			})
			.end(res => resolve(res.body)));
	},

	async putStudents(faculty, students) {
		return new Promise(resolve => unirest.put(new URL('api/v0/student', conf.grade.url).toString())
			.headers(request_headers)
			.query({
				token: conf.grade.token,
				batch: 'json',
			})
			.type('json')
			.send({
				faculty,
				students,
			})
			.end(res => resolve(res.body)));
	},

	async putTeachers(faculty, teachers) {
		return new Promise((resolve) => {
			var CookieJar = unirest.jar();
			CookieJar.add('XDEBUG_SESSION=XDEBUG_ECLIPSE', '/');
			unirest.put(new URL('api/v0/teacher', conf.grade.url).toString())
				.headers(request_headers)
				.query({
					token: conf.grade.token,
					batch: 'json',
				})
				.type('json')
				.send({
					faculty,
					teachers,
				})
				.jar(CookieJar)
				.end(res => resolve(res.body));
		});
	},

	async putGymAttendance(recordBook, date, externalID, semester, year) {
		return new Promise((resolve) => {
			var CookieJar = unirest.jar();
			CookieJar.add('XDEBUG_SESSION=XDEBUG_ECLIPSE', '/');
			unirest.put(new URL('api/v0/sendGymAttendance', conf.grade.url).toString())
				.headers(request_headers)
				.query({
					token: conf.grade.token,
				})
				.type('json')
				.send([{
					year,
					semesterNum: semester,
					recordBook,
					attends: [
						date,
					],
					accountExtID: externalID,
				}])
				.jar(CookieJar)
				.end((res) => {
					resolve(res.body.response);
				});
		});
	},

	putGymAttendanceSync(record, year, semester, after) {
		var CookieJar = unirest.jar();
		CookieJar.add('XDEBUG_SESSION=XDEBUG_ECLIPSE', '/');
		unirest.put(new URL('api/v0/sendGymAttendance', conf.grade.url).toString())
			.headers(request_headers)
			.query({
				token: conf.grade.token,
			})
			.type('json')
			.send([{
				year,
				semesterNum: semester,
				recordBook: record.recordBook,
				attends: record.dates,
				accountExtID: record.externalID,
			}])
			.jar(CookieJar)
			.end((res) => {
				after(res.body.response);
			});
	},

	async logSync() {
		return new Promise(resolve => unirest.put(new URL('api/v0/sync-logs', conf.grade.url).toString())
			.headers(request_headers)
			.query({
				token: conf.grade.token,
			})
			.type('json')
			.send({})
			.end(res => resolve(res.body)));
	},

	async getForms(accountid, year, semester, plan, disciplineID, discipline, groupnum, groupid, gradenum, faculty, study_form, milestone, emulate = false) {
		return new Promise((resolve) => {
			unirest.get(new URL('api/v0/final-report', conf.grade.url).toString())
				.headers(request_headers)
				.query({
					accountid: accountid,
					token: conf.grade.token,
					year: year,
					num: semester,
					plan: plan,
					disciplineID: disciplineID,
					discipline: discipline,
					groupnum: groupnum,
					groupid: groupid,
					gradenum: gradenum,
					faculty: faculty,
					study_form: study_form,
					emulate: emulate,
				})
				.type('json')
				.send({})
				.end(res => resolve(res.body));
		});
	},
};
