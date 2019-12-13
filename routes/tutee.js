var express = require("express");
var router = express.Router();
var handler = require("../handler/tutee");
var auth = require("../plugins/middlewares/auth");
router.get("/", function (req, res, next) {
    res.send("Tutor router");
});
module.exports = router;
