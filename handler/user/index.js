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
  profile: (req, res) => user.profile(req, res),
  updateProfile: (req, res) => user.updateProfile(req, res),
  updatePassword: (req, res) => user.updatePassword(req, res),
  updateAvatar: (req, res) => user.updateAvatar(req, res),
  activateAccount: (req, res) => cb.activateAccount(req, res),
  confirmChange: (req, res) => cb.confirmChange(req, res)
};
