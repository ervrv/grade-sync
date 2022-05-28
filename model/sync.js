const mongoose = require('mongoose');
const moment = require('moment');
const Faculty = require('./faculty');


const SyncSchema = new mongoose.Schema({
	type: {
		type: String,
		required: true,
	},
	facultyID: {
		type: mongoose.Schema.ObjectId,
		required: true,
	},
	lastDate: {
		type: Date,
		required: true,
	},
	enabled: {
		type: Boolean,
		required: true,
	},
});


SyncSchema.methods = {
	async faculty() {
		return Faculty.findById(this.facultyID);
	},

	soapLastDate() {
		return moment(this.lastDate).format('YYYY-MM-DDTHH:mm:ss');
	},
};

SyncSchema.statics = {
	async write(type, facultyID, lastDate, enabled) {
		await module.exports.create({
			type,
			facultyID,
			lastDate,
			enabled,
		});
	},
};

module.exports = mongoose.model('Sync', SyncSchema);
