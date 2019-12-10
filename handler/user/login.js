var passport = require("passport");
var jwt = require("jsonwebtoken");
var config = require("config");

exports.login = (req, res) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.json({
        code: 400,
        message: info ? info.message : "Login failed"
      });
    }

    req.login(user, { session: false }, err => {
      if (err) {
        // log err
        return res.json({
          code: -1,
          message: "Login failed"
        });
      }

      var key = config.get("key_jwt");
      const payload = {
        id: user[0].id,
        username: user[0].username,
        role: user[0].role
      };
      var token = jwt.sign(payload, key);
      if (!token) {
        return res.json({
          code: -1,
          message: "Can't sign token"
        });
      }
      return res.json({
        code: 1,
        message: "OK",
        user: {
          ...payload,
          avatar: user[0].avatar,
          name: user[0].name,
          role: user[0].role
        },
        token
      });
    });
  })(req, res);
};
