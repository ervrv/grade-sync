const mongoose = require('mongoose');
const Faculty = require('./faculty');
const moment = require('moment');

const SyncDataSchema = new mongoose.Schema({
	type: {
		type: String,
		required: true,
	},
	facultyId: {
		type: mongoose.Schema.ObjectId,
		required: false,
	},
	content: {
		type: mongoose.Schema.Types.Mixed,
		default: null,
	},
	lastDate: {
		type: Date,
		required: false,
	},
	completed: {
		type: Boolean,
		required: true,
	},
	params: {
		type: mongoose.Schema.Types.Mixed,
		default: null,
	},
});

SyncDataSchema.methods = {
	async faculty() {
		return Faculty.findById(this.facultyId);
	},

	soapLastDate() {
		return moment(this.lastDate).format('YYYY-MM-DDTHH:mm:ss');
	},
};

SyncDataSchema.statics = {
	async write(type, facultyId, content, lastDate, completed, params) {
		await module.exports.create({
			type,
			facultyId,
			content,
			lastDate,
			completed,
			params,
		});
	},
};

module.exports = mongoose.model('SyncData', SyncDataSchema);
