/**
 * app.js
 *
 * The main web application entry point.
 *
 */
var express = require('express');
var logger = require('morgan');
var favicon = require('serve-favicon');
var commandLineArgs = require("command-line-args");
var controller = require('./src/controllers/peopleController');

// Parse the command line options
const optionDefinitions = [
  {name: "port", type: Number},
];
var options = commandLineArgs(optionDefinitions);

var app = express();
app.use(favicon(__dirname + '/public/images/favicon.png'));
app.use(logger('dev'));
// Reference the public directory for static files (JavaScript, CSS, etc.)
app.use(express.static('public'));
app.set('views', 'src/views');
app.set('view engine', 'ejs');
app.set('port', options.port || 5000);

// GET /?searchTerm=stark&page=2
app.get('/', function(req, res) {
  controller.getIndex(req, res);
});

// GET /58309fd12389a81864566af3
app.get('/:id', function (req, res) {
	controller.getById(req, res);
});

// Catch-all for all other routes.
app.use(function (req, res) {
	res.status(404).send('404 - Not found');
});

// Simple error handling middleware
app.use(function (err, req, res, next) {
	console.log(err);
	res.status(500).send('500 - Error');
});

app.listen(app.get('port'), function(err) {
	console.log('Server running on port ' + app.get('port'));
});
