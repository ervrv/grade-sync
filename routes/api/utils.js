
let shortenText = function(text) {
	let lines = text.split(/\r?\n/);
	if (lines.length == 1) {
		return text;
	} else {
		return lines[lines.length - 1].trim();
	}
}

module.exports = {
	"shortenText": shortenText
}
