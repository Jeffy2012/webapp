/**
 * Module dependencies.
 */

var express = require('express');
//var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require("fs");

var app = express();

// all environments
//app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../app/views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
//app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
app.get("/", function (req, res) {
    res.render("index");
});
module.exports = app;