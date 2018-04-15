
var fs = require('fs');
var url = require('url');
var bodyParser = require('body-parser');        
var express = require('express');
var path = require('path');                     
var cors = require('cors')
var app = express();
var router = require('./routes/index');


var http = require('http');                     //???
var createError = require('http-errors');       //???
var cookieParser = require('cookie-parser');    //???
var logger = require('morgan');                 //???
var multer = require('multer');

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// request 파서
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(router)

app.use(multer({
  dest: './public/uploads/',
  rename: function (fieldname, filename) {
    return Date.now();
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
  }
}).any());



var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    database: 'devdb',
    user: 'devuser',
    password: 'devpass'
});
connection.connect();



app.post('/api/photo', function (req, res) {
  var file = req.files[0];
  var filename = file.filename;
  var original = file.originalname;
  var size = file.size;
  var name = req.req.param('name');
  var message = req.req.param('message');

  connection.connect();

  connection.query(`INSERT INTO board (id, name, filename, original, size, reg_date)
  VALUES (null, ?, ?, ?, ?, ?);`,
    [name, message, filename, original, size]
    , function (error, results, fields) {
      var resultObj = {};
      if (err) {
          resultObj.success = false;
          console.log(err);
      } else {
          resultObj.success = true;
          resultObj.id = result.insertId;
      }
      res.send(JSON.stringify(resultObj));
    });

  connection.end();
  res.end(JSON.stringify(req.resultObj));
});

// 상세보기
app.get('/view.json', function(req, res) {
  var id = req.param('id');
  view(id, res);
});

// 목록보기
app.get('/list.json', function(req, res) {
  var pageNo = req.param('pageNo');
  list(pageNo, res);
});

// 저장하기
function save(message, res) {
  var query = connection.query('INSERT INTO board SET ?', message, function (err, result) {
      var resultObj = {};
      if (err) {
          resultObj.success = false;
          console.log(err);
      } else {
          resultObj.success = true;
          resultObj.id = result.insertId;
      }
      res.send(JSON.stringify(resultObj));
  });
  console.log(query.sql);
}

// 상세보기
function view(id, res) {
  console.log(id);
  var query = connection.query('select * from board where id = ' +
                               connection.escape(id), function (err, result) {
      var resultObj = {};
      if (err) {
          resultObj.success = false;
          console.log(err);
      } else {
          res.json(result);
          return;
      }
      res.send(JSON.stringify(resultObj));
  });
  console.log(query.sql);
}

// 목록보기
function list(pageNo, res) {
  console.log(pageNo);
  var num = parseInt(pageNo) - 1;
  if (num < 0) {
      num = 0;
  }
  var query = connection.query('select * from board order by id desc limit ?, ?'
                               , [num * 3, 3]
                               , function (err, results) {
      var resultObj = {};
      if (err) {
          resultObj.success = false;
          console.log(err);
      } else {
          count(res, results);
          return;
      }
      res.send(resultObj);
  });
  console.log(query.sql);
}

// 전체 게시물 수
function count(res, list) {
  var query = connection.query('select count(*) as count from board'
                               , function (err, results) {
      var resultObj = {};
      if (err) {
          resultObj.success = false;
          console.log(err);
      } else {
          resultObj.count = results[0].count;
          resultObj.perpage = 3;
          resultObj.list = list;
          res.json(resultObj);
          return;
      }
      res.send(resultObj);
  });
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), function () {
  console.log('Server running at http://127.0.0.1:' + app.get('port'));
});

process.on('uncaughtException', function (err) {
  console.log(err);
}); 

module.exports = app;
