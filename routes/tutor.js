var express = require("express");
var router = express.Router();

var handler = require("../handler/tutor");
var auth = require("../plugins/middlewares/auth");

router.get("/", (req, res, next) => {
  res.send("Tutor router");
});

router.post(
  "/updateskills",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {
    var payload = req.locals.payload;
    if (!payload) {
      return res.status(500).json({
        code: -1,
        message: "Internal error"
      });
    }
    if (payload.role != 1) {
      return res.status.json({
        code: -1,
        message: "Tutor only"
      });
    }
    handler.updateSkills(req, res);
  }
);

router.get("/getlist/:offset?/:limit?", (req, res) => {
  console.log(req.params);
  handler.getList(req, res);
});

router.post(
  "/updateintro",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {
    handler.updateIntro(req, res);
  }
);

router.get(
  "/getprofile/:tutorID",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {
    handler.getProfile(req, res);
  }
);

module.exports = router;
