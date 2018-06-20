//initial file 
var express=require('express');
var app=express();
var router = express.Router();

var path=require('path');
var async=require('async');

var bodyParser=require('body-parser');
var morgan=require('morgan');
var appRoutes=require('./modules/api')(router);

var passportjs=require('passport');
var passport=require('./modules/passport')(app,passportjs);

var mongoose=require('mongoose');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);




app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'))
});


app.listen(8000,function (err) {
    console.log("Server is Running on Port 8000");
});


