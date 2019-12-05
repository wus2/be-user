var express = require("express");
var router = express.Router();

var auth = require("../plugins/middlewares/auth");
var handler = require("../handler/admin");

router.get(
  "/skills/:offset/:limit",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {
    handler.getSkills(req, res);
  }
);

router.post(
  "/addskill",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {}
);

router.post(
  "/updateskill",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {}
);

router.delete(
  "/remove/:id",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {
    handler.removeSkill(req, res);
  }
);
