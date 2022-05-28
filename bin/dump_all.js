const teachers = require('../routes/api/syncTeachers')

const dumpAll = async function () {
	await teachers.dump_teachers(false, false, false);
};

dumpAll()
