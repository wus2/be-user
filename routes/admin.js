var express = require("express");
var router = express.Router();

var auth = require("../plugins/middlewares/auth");
var handler = require("../handler/admin");

router.get(
  "/skills/offset/:offset/limit/:limit",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {
    handler.getSkills(req, res);
  }
);

router.get(
  "/getskill/:id",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {
    handler.getSkill(req, res);
  }
);

router.post(
  "/addskill",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {
    handler.addSkill(req, res);
  }
);

router.put(
  "/updateskill",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {
    handler.updateSkill(req, res);
  }
);

router.delete(
  "/removeskill/:id",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {
    handler.removeSkill(req, res);
  }
);

router.get(
  "/getusers/offset/:offset/limit/:limit",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {
    handler.getUsers(req, res);
  }
);

router.get(
  "/user/:id",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {
    handler.getUserProfile(req, res);
  }
);

module.exports = router;
