const getPlans = require('./plans');
const getStudents = require('./students');
const getSubdivisions = require('./subdivisions');
const getTeachers = require('./teachers');
const uploadForms = require('./officialForms').uploadForms;
const uploadXML = require('./officialForms').uploadXML;
const getFormUploadXML = require('./officialForms').getUploadFormXML;


module.exports = {
	getPlans,
	getStudents,
	getSubdivisions,
	getTeachers,
	uploadForms,
	uploadXML,
	getFormUploadXML,
};
