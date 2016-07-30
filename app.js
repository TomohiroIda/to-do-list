var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();

//mongoose
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://heroku_xztb7z8q:sqdd4viit7ornk8vueku6ii9pf@ds031845.mlab.com:31845/heroku_xztb7z8q');
var Schema = mongoose.Schema;
var Todo = new Schema({
  name: {type: String, index: true},
  todo_state: Number
});
Todo.pre('save', function(next) {
  if (this.isNew) {
    this.todo_state = 0;
  }
  next();
});

var Task = mongoose.model('Todo', Todo);
var tasknames = new Array();
var fetchtask = function(res){
    Task.find({}, function(err, docs) {
        if(!err) {
            //console.log("num of item => " + docs.length)
            for (var i = 0; i < docs.length; i++ ) {
                //console.log(docs[i]);
                tasknames[i] = docs[i].name;
            }
            console.log(tasknames);
            res.render('index', {firsttask: tasknames[0]});
        }});
};

// post
app.use(bodyParser.urlencoded({extended: true}));
app.post('/', function(req, res) {
    var task = new Task();
    task.name = req.body.word;
    task.todo_state = 1;
    task.save(function(err) {
        if (err) { console.log(err); }
    });
    console.log(req.body);
    fetchtask(res);
    // res.render('index', {word: req.body.word});
    
    
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use(function(req, res, next){fetchtask(res)});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
