const mongoose = require('mongoose');
const Faculty = require('./faculty');

const DisciplinesSchema = new mongoose.Schema({
	facultyID: {
		type: mongoose.Schema.ObjectId,
		required: true,
	},
	planExternalID: {
		type: String,
		required: true,
	},
	learningPlanExtID: {
		type: String,
		required: true,
	},
	global: {
		type: String,
		required: false,
	},
	name: {
		type: String,
		required: true,
	},
	externalID: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	teachers: {
		type: mongoose.Schema.Types.Mixed,
	},
	year: {
		type: String,
		required: true,
	},
	semester: {
		type: String,
		required: true,
	},
	form: {
		type: String,
		required: false,
	},
	course: {
		type: String,
		required: false,
	},
	grade: {
		type: String,
		required: false,
	},
	controlYear: {
		type: String,
		required: true,
	},
	controlSemester: {
		type: String,
		required: true,
	},
	mongoLastSync: {
		type: Date,
		required: false,
	},
	gradeLastSync: {
		type: Date,
		required: false,
	},
});

DisciplinesSchema.methods = {
	async faculty() {
		return Faculty.findById(this.facultyID);
	},
	// async plan() {
	// 	return Faculty.findById(this.planID);
	// },
};

DisciplinesSchema.statics = {
	async write(
		facultyID, planExternalID, learningPlanExtID, name, externalID, type, global, teachers,
		year, semester, form, controlYear, controlSemester, course = '0', grade = 'bachelor',
		mongoLastSync, gradeLastSync,
	) {
		await module.exports.create({
			facultyID,
			planExternalID,
			learningPlanExtID,
			name,
			externalID,
			type,
			global,
			teachers,
			year,
			semester,
			form,
			controlYear,
			controlSemester,
			course,
			grade,
			mongoLastSync,
			gradeLastSync,
		});
	},
};

module.exports = mongoose.model('Disciplines', DisciplinesSchema);
