const mongoose = require('mongoose');
const Faculty = require('./faculty');

const StudentsSchema = new mongoose.Schema({
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
	recordBooks: {
		type: mongoose.Schema.Types.Mixed,
		default: null,
	},
	mongoLastSync: {
		type: Date,
		default: false,
	},
	gradeLastSync: {
		type: Date,
		default: false,
	},
});

StudentsSchema.methods = {
	async faculty() {
		return Faculty.findById(this.facultyID);
	},
};

StudentsSchema.statics = {
	async write(facultyID, externalID, firstName, secondName, lastName, recordBooks) {
		await module.exports.create({
			facultyID,
			externalID,
			firstName,
			secondName,
			lastName,
			recordBooks,
		});
	},
};

module.exports = mongoose.model('Students', StudentsSchema);
