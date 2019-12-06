var express = require("express");
var router = express.Router();

var handler = require("../handler/tutor");
var auth = require("../plugins/middlewares/auth");

router.post(
  "/login",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {
    handler.updateSkills(req, res);
  }
);
