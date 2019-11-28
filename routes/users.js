var express = require('express');
var router = express.Router();
var handler = require('../handler/users')

router.get('/profile', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
  handler.login(req, res, next);
});

router.post('/register', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
