var express = require('express')
var cors = require('cors')
var app = express()
var router = express.Router()
var path = require('path')
var main = require('./main/main')
var email = require('./email/email')
var join = require('./join/index')
var board = require('./board/board')
  
router.get('/', defaultPage);
router.get('/write', defaultPage);
router.get('/list/*', defaultPage);
router.get('/view/*', defaultPage);

function defaultPage(req, res) {
  res.sendFile(path.join(__dirname, '../public/main.html'))
}

router.use('/main', main)   
router.use('/email', email)
router.use('/join',join)  
router.use('/board',board)




module.exports = router;
