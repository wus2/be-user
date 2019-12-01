const passport = require("passport");

module.exports = {
  authen: (req, res) => {
    passport.authenticate("jwt", { session: false }, payload => {
      req.locals.payload = payload;
    });
  }
};
