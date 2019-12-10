var express = require("express");
var router = express.Router();
var passport = require("passport");

var handler = require("../handler/user");
var auth = require("../plugins/middlewares/auth");
var upload = require("../plugins/middlewares/upload");

router.post("/login", (req, res) => {
  handler.login(req, res);
});

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);

router.get("/auth/facebook/callback", (req, res, next) => {
  handler.loginViaFB(req, res);
});

router.get("/auth/google", passport.authenticate("google", { scope: "email" }));

router.get("/auth/google/callback", (req, res, next) => {
  handler.loginViaGG(req, res);
});

router.post("/register", (req, res) => {
  handler.register(req, res);
});

router.get(
  "/profile",
  (req, res, next) => {
    auth.authen(req, res);
    next();
  },
  (req, res) => {
    var payload = res.locals.payload;
    handler.profile(req, res, payload);
  }
);

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
    handler.updatePassword(req, res);
  }
);

router.post(
  "/updateavatar",
  // (req, res, next) => {
  //   auth.authen(req, res);
  //   next();
  // },
  (req, res, next) => {
    upload.uploadImage(req, res);
    next();
  },
  (req, res) => {
    var payload = res.locals.payload;
    // sleep to ensure filename is forwarded
    setTimeout(() => {
      handler.updateAvatar(req, res, payload);
    }, 500);
  }
);

router.get("/activeaccount/:username", (req, res) => {
  handler.activateAccount(req, res);
});

router.get("/confirmchange/:id", (req, res) => {
  handler.confirmChange(req, res);
});

module.exports = router;
