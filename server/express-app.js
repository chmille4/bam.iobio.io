var express = require('express');
var app = express();
var port = process.env.PORT || 3001;
var path = require('path');
var history = require('connect-history-api-fallback');

app.use(history());
app.use(express.static(path.join(__dirname, '..', 'client')));

module.exports = app;
