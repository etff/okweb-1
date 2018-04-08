var express = require('express')
var cors = require('cors')
var app = express()
var router = express.Router()
var path = require('path')

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../../public/main.html'))               //상대 경로를 써주고자할때
  });

  module.exports = router;