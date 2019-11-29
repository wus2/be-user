var express = require('express');
var router = express.Router();
var handler = require('../handler/users');

router.get('/profile', function(req, res, next) {
  handler.profile(req, res)
});

router.post('/login', function(req, res, next) {
  handler.login(req, res);
});

router.post('/register', function(req, res, next) {
  handler.register(req, res);
});

router.post('/update', function(req, res, next) {
  handler.update(req, res);
});

module.exports = router;
