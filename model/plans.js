const mongoose = require('mongoose');
const Faculty = require('./faculty');

const PlansSchema = new mongoose.Schema({
	facultyId: {
		type: mongoose.Schema.ObjectId,
		required: true,
	},
	externalID: {
		type: String,
		required: true,
	},
	learningPlanExtID: {
		type: String,
		required: true,
	},
	disciplines: {
		type: mongoose.Schema.Types.Mixed,
		default: null,
	},
	year: {
		type: Number,
		required: true,
	},
	semester: {
		type: Number,
		required: true,
	},
	form: {
		type: Number,
		required: false,
	},
});

PlansSchema.methods = {
	async faculty() {
		return Faculty.findById(this.facultyID);
	},
};

PlansSchema.statics = {
	async write(facultyId, externalID, learningPlanExtID, disciplines, year, semester, form) {
		await module.exports.create({
			facultyId,
			externalID,
			learningPlanExtID,
			disciplines,
			year,
			semester,
			form,
		});
	},
};

module.exports = mongoose.model('Plans', PlansSchema);
