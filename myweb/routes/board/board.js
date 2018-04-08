var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var mysql = require('mysql')
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var url = require('url');


var connection = mysql.createConnection({
    host: 'localhost',
    database: 'devdb',
    user: 'devuser',
    password: 'devpass'
});
connection.connect();

//????
// router.get('/board/*', function(req, res) {
//     res.sendFile(__dirname + '../../public/webform11.html');
//   });

app.post('/board/save.json', function (req, res) {
    var message = {};
    message.name = req.param('name');
    message.email = req.param('email');
    message.message = req.param('msg');
    save(message, res);
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


module.exports = router;