var winston = require('winston');

var config = require('./config');
var server = require('./server');

// We will log normal api operations into api.log
console.log("starting logger...");
winston.add(winston.transports.File, {
  filename: config.logger.api
});

// We will log all uncaught exceptions into exceptions.log
winston.handleExceptions(new winston.transports.File({
	filename: config.logger.exception
}));

server.start();
console.log("Successfully started web server. Waiting for incoming connections...");