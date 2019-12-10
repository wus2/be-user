var express = require("express");
var router = express.Router();

var handler = require("../handler/tutor");
var auth = require("../plugins/middlewares/auth");

router.get("/", (req, res, next) => {
  res.send("Tutor router");
});

router.put(
  "/updateskills",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {
    var payload = res.locals.payload;
    if (!payload) {
      return res.status(401).json({
        code: -1,
        message: "Unauthentiacted"
      });
    }
    if (payload.role != 1) {
      return res.status.json({
        code: -1,
        message: "Tutor only"
      });
    }
    handler.updateSkills(req, res, payload);
  }
);

router.get("/getlist/offset/:offset/limit/:limit", (req, res) => {
  handler.getList(req, res);
});

router.put(
  "/updateintro",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {
    handler.updateIntro(req, res);
  }
);

router.get("/getprofile/:tutorID", (req, res) => {
  handler.getProfile(req, res);
});

router.get("/filtertutor/offset/:offset/limit/:limit", (req, res) => {});

module.exports = router;
