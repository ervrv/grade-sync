const mongoose = require('mongoose');


const AttendanceLogSchema = new mongoose.Schema({
	msg: {
		type: String,
		required: false,
	},
	date: {
		type: Date,
		required: true,
	},
	studentId: {
		type: String,
		required: true,
	},
	uploadDate: {
		type: Date,
		required: true,
		default: Date.now(),
	},
});


AttendanceLogSchema.statics = {
	async write(msg, date, studentId) {
		let content = msg;
		if (msg instanceof Error) {
			content = msg.stack;
		}

		await module.exports.create({
			msg: content,
			date,
			studentId,
		});
	},
};


module.exports = mongoose.model('AttendanceLog', AttendanceLogSchema);
