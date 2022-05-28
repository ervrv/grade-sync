#!/usr/bin/env node

const logger = require('../lib/logger');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
	{ name: 'enableDismissed', alias: 'd', type: Boolean, defaultValue: false},
	{ name: 'type', type: String, multiple: true },
	{ name: 'year', alias: 'y', type: Number },
	{ name: 'semester', alias: 's', type: Number },
	{ name: 'form', alias: 'f', type: Number, defaultValue: 1 },
];

const options = commandLineArgs(optionDefinitions);

console.log(options);
