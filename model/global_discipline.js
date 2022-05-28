const mongoose = require('mongoose');
const Faculty = require('./faculty');
// const moment = require('moment');

const GlobalDisciplinesSchema = new mongoose.Schema({
	facultyExternalId: {
		type: String,
		required: false,
	},
	name: {
		type: String,
		required: false,
	},
	subject: {
		type: String,
		required: true,
	},
	subjectExternalID: {
		type: String,
		required: true,
	},
	students: {
		type: mongoose.Schema.Types.Mixed,
	},
	teachers: {
		type: mongoose.Schema.Types.Mixed,
	},
	year: {
		type: Number,
		required: true,
	},
	semester: {
		type: Number,
		required: true,
	},
});

GlobalDisciplinesSchema.methods = {
};

GlobalDisciplinesSchema.statics = {
	async write(facultyExternalId, name, subject, subjectExternalID, students, teachers, year, semester) {
		await module.exports.create({
			facultyExternalId,
			name,
			subject,
			subjectExternalID,
			students,
			teachers,
			year,
			semester,
		});
	},
};

module.exports = mongoose.model('GlobalDisciplines', GlobalDisciplinesSchema);
