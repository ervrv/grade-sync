const mongoose = require('mongoose');


const LogSchema = new mongoose.Schema({
	msg: {
		type: String,
		required: false,
	},
	level: {
		type: Number,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	time: {
		type: Date,
		required: true,
		default: Date.now(),
	},
	content: {
		type: Object,
		required: false,
	},
});


// LogSchema.statics = {
// 	async write(msg, level, name, time, content) {
// 		if (msg instanceof Error) {
// 			content = msg.stack;
// 		}
//
// 		await module.exports.create({
// 			msg,
// 			level,
// 			name,
// 			time,
// 			content,
// 		});
// 	},
// };


module.exports = mongoose.model('Log', LogSchema);
