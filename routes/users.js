var express = require("express");
var router = express.Router();
var passport = require("passport");

var handler = require("../handler/users");
var auth = require("../plugins/middlewares/auth");
var upload = require("../plugins/middlewares/upload");

router.post("/login", (req, res) => {
  handler.login(req, res);
});

router.get("/loginviafb/callback", (req, res, next) => {
  passport.authenticate("facebook", {
    successRedirect: "/success",
    failureRedirect: "/failure"
  });
});

router.get("/failure", (req, res) => {
  res.send("Failed attempt");
});

router.get("/success", (req, res) => {
  res.send("Success");
});

router.get(
  "/profile",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {
    console.log(req.headers);
    var payload = res.locals.payload;
    handler.profile(req, res, payload);
  }
);

router.post("/register", (req, res) => {
  handler.register(req, res);
});

router.post(
  "/updateprofile",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {
    var payload = res.locals.payload;
    handler.updateProfile(req, res, payload);
  }
);

router.post(
  "/updatepassword",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {
    var payload = res.locals.payload;
    handler.updatePassword(req, res, payload);
  }
);

router.post(
  "/updateavatar",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res, next) => {
    upload.uploadImage(req, res);
    next();
  },
  (req, res) => {
    var payload = res.locals.payload;
    handler.updateAvatar(req, res, payload);
  }
);

router.get("/activeaccount/:username", (req, res) => {
  handler.activateAccount(req, res);
});

router.get("/confirmchange/:id", (req, res) => {
  handler.confirmChange(req, res);
});

module.exports = router;
