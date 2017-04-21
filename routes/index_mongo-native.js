var express = require('express');
var router = express.Router();
var fs = require('fs');
var readData = require('./myModules/readData.js');
var writeData = require('./myModules/writeData');
var dbpath = require('./myModules/dbpath.js');
var lib = require('./myModules/lib.js');

var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var config = require('./myModules/config.js');
var ObjectID = require('mongodb').ObjectID;

// Connection URL
var dbUrl = config.dbUrl();

/* GET home page. */
router.get('/', function(req, res, next) {
    // Use connect method to connect to the server
    //‘localhost:3000’에 접속하면 MongoClient에 의해서 project_todo데이터베이스에 접근한다. 
    //그리고 그 정보를 callback함수의 매개변수인 db를 통해서 반환한다. 이제부터는 MongoClient안에서 모든 작업을 할 것이다.
    MongoClient.connect(dbUrl, function(err,db){
        readData(db, function(err, data) {
            assert.equal(err, null);
            db.close();
            res.render('index', {todo:data});
        });
    }); 
});

router.post('/task-register', function(req, res) {
    var date = new Date(req.body.date);
    var newTask = req.body.task;
    var obj = {"date":date, "task":newTask, "done":false};

    /* Mongo DB */
    MongoClient.connect(dbUrl, function(err,db) {
        writeData(db, obj, function(err, result){
        assert.equal(null, err);
        assert.equal(1, result.insertedCount);
        db.close();
        res.redirect('/');
        })
    });
});

router.post('/task-done', function(req, res) {
  var checked= req.body.checked;
  var objectId = [];
  console.log("chekced: " + checked);
  if(lib.isArray(checked)){
    for(var i=0; i<checked.length; i++){
      objectId.push(new ObjectID(checked[i]));
    }
  } else {
    objectId.push(new ObjectID(checked));
  }
  /* Mongo DB */
  MongoClient.connect(dbUrl, function(err,db) {
    var collection = db.collection('testCollection');
    collection.updateMany( {'_id':{$in:objectId}}, {$set:{'done':true}}, function(err){
      assert.equal(null, err);
      db.close();
      res.redirect('/');
    });
  });
});

module.exports = router;
