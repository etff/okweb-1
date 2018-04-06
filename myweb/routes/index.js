var express = require('express')
var cors = require('cors')
var app = express()
var router = express.Router()
var path = require('path')
var main = require('./main/main')
var email = require('./email/email')
var join = require('./join/index')
var board = require('./board/board')

var bodyParser = require('body-parser');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    database: 'devdb',
    user: 'devuser',
    password: 'devpass'
});
connection.connect();

// request 파서
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// router.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname, '../public/main.html'))
//   });
  
router.get('/', defaultPage);
router.get('/write', defaultPage);
router.get('/list/*', defaultPage);
router.get('/view/*', defaultPage);

function defaultPage(req, res) {
  res.sendFile(path.join(__dirname, '../public/main.html'))
}

router.use('/main', main)   //라우터 정보를 받아서 그쪽으로 가라
router.use('/email', email)
router.use('/join',join)  
router.use('/board',board)




module.exports = router;
