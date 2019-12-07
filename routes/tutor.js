var express = require("express");
var router = express.Router();

var handler = require("../handler/tutor");
var auth = require("../plugins/middlewares/auth");

router.post(
  "/updateskills",
  (req, res, netx) => {
    auth.authen(req, res);
    netx();
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
      })
    }
    handler.updateSkills(req, res);
  }
);

module.exports = router;
