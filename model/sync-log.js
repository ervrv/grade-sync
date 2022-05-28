const mongoose = require('mongoose');


const SyncLogSchema = new mongoose.Schema({
	type: {
		type: String,
		required: true,
	},
	facultyID: {
		type: mongoose.Schema.ObjectId,
		required: false,
	},
	date: {
		type: Date,
		required: true,
		default: Date.now(),
	},
	message: {
		type: String,
		required: true,
	},
	content: {
		type: mongoose.Schema.Types.Mixed,
		default: null,
	},
});


SyncLogSchema.statics = {
	async write(type, facultyID, message, content) {
		if (content instanceof Error) {
			content = content.stack;
		}

		await module.exports.create({
			type,
			facultyID,
			message,
			content,
		});
	},
};


module.exports = mongoose.model('SyncLog', SyncLogSchema);
