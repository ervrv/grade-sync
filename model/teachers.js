const mongoose = require('mongoose');
const Faculty = require('./faculty');

const TeachersSchema = new mongoose.Schema({
	facultyID: {
		type: mongoose.Schema.ObjectId,
		required: true,
	},
	externalID: {
		type: String,
		required: true,
	},
	firstName: {
		type: String,
		required: false,
	},
	secondName: {
		type: String,
		required: false,
	},
	lastName: {
		type: String,
		required: false,
	},
	status: {
		type: String,
		required: true,
	},
	jobPositionName: {
		type: String,
		required: true,
	},
	inila: {
		type: String,
		required: false,
	},
	departmentExternalID: {
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

TeachersSchema.methods = {
	async faculty() {
		return Faculty.findById(this.facultyID);
	},
};

TeachersSchema.statics = {
	async write(
		facultyID, externalID, inila, firstName, secondName, lastName,
		jobPositionName, status, departmentExternalID, mongoLastSync, gradeLastSync,
	) {
		await module.exports.create({
			facultyID,
			externalID,
			inila,
			firstName,
			secondName,
			lastName,
			jobPositionName,
			status,
			departmentExternalID,
			mongoLastSync,
			gradeLastSync,
		});
	},
};

module.exports = mongoose.model('Teachers', TeachersSchema);
