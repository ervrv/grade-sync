const mongoose = require('mongoose');
const Faculty = require('./faculty');
// const moment = require('moment');

const FinalFormsSchema = new mongoose.Schema({
	disciplineID: {
		type: String,
		required: true,
	},
	groupID: {
		type: String,
		required: true,
		default: null,
	},
	requestXML: {
		type: String,
		required: false,
	},
	requestJSON: {
		type: mongoose.Schema.Types.Mixed,
		default: null,
		required: false,
	},
	soapResponse: {
		// http://gitlab.mmcs.sfedu.ru/it-lab/grade/-/issues/869
		// weird response json causing mongoose to loop
		//type: mongoose.Schema.Types.Mixed,
		type: String,
		default: null,
		required: false,
	},
	exportDate: {
		type: Date,
		default: Date.now,
		required: false,
	},
	year: {
		type: String,
		required: true,
		default: null,
	},
	semester: {
		type: String,
		required: true,
		default: null,
	},
	milestone: {
		type: String,
		required: true,
		default: null,
	},
	studyPlan: {
		type: String,
		required: true,
		default: null,
	},
	faculty: {
		type: String,
		required: true,
		default: null,
	},
});

FinalFormsSchema.methods = {
};

FinalFormsSchema.statics = {
	async write(disciplineID, groupID, requestXML, requestJSON, soapResponse, year, semester, milestone, studyPlan, faculty) {
		await module.exports.create({
			disciplineID,
			groupID,
			requestXML,
			requestJSON,
			soapResponse: JSON.stringify(soapResponse),
			year,
			semester,
			milestone,
			studyPlan,
			faculty,
		});
	},
};

module.exports = mongoose.model('FinalForms', FinalFormsSchema);
