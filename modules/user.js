var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var MongoClient=require('mongodb').MongoClient;
var connect = function (cb)
{
    MongoClient.connect("mongodb://localhost:27017/Way2Buzz", function (err, db) {
    cb(err,db);
    })
}

module.exports={mongoConnect:connect};
