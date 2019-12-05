var login = require("./login");
var fb = require("./login_via_fb");
var gg = require('./login_via_gg')
var regis = require("./register");
var user = require("./mange_profile");
var cb = require("./callback");

module.exports = {
  login: (req, res) => login.login(req, res),
  loginViaFB: (req, res) => fb.loginViaFB(req, res),
  loginViaGG: (req, res) => gg.loginViaGG(req, res),
  register: (req, res) => regis.register(req, res),
  profile: (req, res, payload) => user.profile(req, res, payload),
  updateProfile: (req, res, payload) => user.updateProfile(req, res, payload),
  updatePassword: (req, res, payload) => user.updatePassword(req, res, payload),
  updateAvatar: (req, res, payload) => user.updateAvatar(req, res, payload),
  activateAccount: (req, res) => cb.activateAccount(req, res),
  confirmChange: (req, res) => cb.confirmChange(req, res)
};
