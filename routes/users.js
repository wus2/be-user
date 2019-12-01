var express = require("express");
var router = express.Router();

var handler = require("../handler/users");
var auth = require("../plugins/middlewares/auth");
var upload = require("../plugins/middlewares/upload");

const urlIgnored = ["login", "register", "activeaccount", "confirmchange"];

function isIgnore(url) {
  return urlIgnored.includes(url);
}

router.use((req, res, next) => {
  try {
    var url = req.originalUrl.split("/")[2];
  } catch (err) {
    console.log(err)
  }
  if (isIgnore(url)) {
    next();
  } else {
    auth.authen(req, res);
    next();
  }
});

router.get("/profile", (req, res) => {
  console.log(req.headers);
  var payload = res.locals.payload;
  handler.profile(req, res, payload);
});

router.post("/login", (req, res) => {
  handler.login(req, res);
});

router.post("/register", (req, res) => {
  handler.register(req, res);
});

router.post("/updateprofile", (req, res) => {
  var payload = res.locals.payload;
  handler.updateProfile(req, res, payload);
});

router.post("/updatepassword", (req, res) => {
  var payload = res.locals.payload;
  handler.updatePassword(req, res, payload);
});

router.post(
  "/updateavatar",
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
