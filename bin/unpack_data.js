#!/usr/bin/env node

require('../boot/mongo')();
// var debug = require('debug')('aesthetics-demo:server');
const unpack = require('../utils/unpack');

// use as node /bin/unpack_data.js <teachers|plans|students> <faculty mongo id>

const fId = process.argv[3]; // 59f89490055286927b633476
const collectionType = process.argv[2];

if (collectionType === 'teachers') {
	unpack.unpack_teachers(fId);
} else if (collectionType === 'plans') {
	unpack.unpack_plans(fId);
} else if (collectionType === 'students') {
	unpack.unpack_students(fId);
} else if (collectionType === 'disciplines') {
	unpack.unpack_disciplines(fId);
}
