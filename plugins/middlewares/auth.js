const passport = require("passport");

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
  }
};
