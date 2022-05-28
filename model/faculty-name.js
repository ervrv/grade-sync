const enabledFaculties = require('../conf/enabled_faculties');

const facultyNameById = function (id) {
	const faculty = enabledFaculties.facultyList.filter(e => e.id === id)[0];
	return faculty.shortName;
};

module.exports = {
	facultyName: facultyNameById,
};

