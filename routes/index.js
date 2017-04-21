var express = require('express');
var router = express.Router();
var lib = require('./myModules/lib.js');
var assert = require('assert');

// // Connection URL
// var config = require('./myModules/config');
// var dbUrl = config.dbUrl();

// var mongoose = require('mongoose');
// mongoose.connect(config.dbUrl());

// var todoSchema = mongoose.Schema({
//   date:Date,
//   task:String,
//   done:Boolean
// });

// var todo = mongoose.model("todo", todoSchema, 'testCollection');

// Connection URL
var config = require('./myModules/config_board');
var dbUrl = config.dbUrl();

// Connect to the db
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl());
var db =mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected");
});

/* GET home page. */
router.get('/', function(req, res, next) {
  /* mongoose */
  todo.find({},function(err, docs){
    console.log(docs);
    res.render('index', {todo:docs});
  });
});

/* Register new task*/
router.post('/task-register', function(req, res) {
  var date = new Date(req.body.date);
  var newTask = req.body.task;
  var obj = {"date":date, "task":newTask, "done":false};
  /* mongoose */
  var task = new todo(obj);
  task.save(function(err){
    if(err) console.log(err);
    res.redirect('/');
  });
});


router.post('/task-done', function(req, res) {
  var checked= req.body.checked;
  var objectId = [];
  if(lib.isArray(checked)){
    for(var i=0; i<checked.length; i++){
      objectId.push(checked[i]);
    }
  } else {
    objectId.push(checked);
  }
  /* mongoose */
  todo.update({'_id':{$in:objectId}}, {$set:{'done':true}}, {multi:true}, function(err){
    if(err) console.log(err);
    res.redirect('/');
  });
});

module.exports = router;
