const app = require('express')();

require('./boot/dotenv')();
require('./boot/mongo')();
require('./boot/express')(app);
require('./boot/router')(app);

module.exports = app;
