var express = require("express");
var router = express.Router();
var handler = require("../handler/users");

router.get("/profile", function(req, res, next) {
  handler.profile(req, res);
});

router.post("/login", function(req, res, next) {
  handler.login(req, res);
});

router.post("/register", function(req, res, next) {
  handler.register(req, res);
});

router.post("/updateprofile", function(req, res, next) {
  handler.updateProfile(req, res);
});

router.post("/updatepassword", function(req, res, next) {
  handler.updatePassword(req, res);
});

router.get("/activeaccount/:username", function(req, res, next) {
  handler.activateAccount(req, res);
});

router.get("/confirmchange/:id", function(req, res, next) {
  handler.confirmChange(req, res);
});

module.exports = router;
