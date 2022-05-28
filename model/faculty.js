const mongoose = require('mongoose');


const FacultySchema = new mongoose.Schema({
	externalID: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
});


module.exports = mongoose.model('Faculty', FacultySchema);
