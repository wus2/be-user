const passport = require("passport");
var handler = require("../../handler/users");

module.exports = {
  authen: (req, res) => {
    passport.authenticate("jwt", { session: false }, payload => {
      if (!payload) {
        return res.status(400).json({
          code: -1,
          message: "Unauthenticated!"
        });
      }

      // forward payload
      res.locals.payload = payload;
    })(req, res);
  },

  authenFB: (req, res) => {
    passport.authenticate(
      "facebook",
      {
        session: false
      },
      (err, user, info) => {
        if (err || !user) {
          console.log("[authenticate][facebook][callback] err", err, info);
          err = {
            code: -1,
            message: "Authenticate via facebook failed!"
          };
        }
        handler.loginViaFB(req, res, err, user);
      }
    )(req, res);
  }
};
