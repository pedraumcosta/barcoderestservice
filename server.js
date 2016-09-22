//constantes e modulos
const express  = require('express');
const fs       = require('fs');
var bodyParser = require('body-parser');

const config  = require('./config');
const routes  = require('./routes');

const app     = express();

var expressLogFile = fs.createWriteStream(config.logger.express, {flags: 'a'});

// Configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 3000;

// *******************************************************

var start = function() {
  routes.setup(app);
  app.listen(port);
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
}

exports.start = start;