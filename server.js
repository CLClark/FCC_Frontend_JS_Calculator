'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
const fs = require('fs');
var http = require('http');

var app = express();

app.use('/public', express.static(process.cwd() + '/public'));

routes(app);

const server = http.createServer(app);

var port = 8080;

server.listen(port, function () {
	console.log('Node.js listening on port ' + port + '...');
});



