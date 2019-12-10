var mailer = require("../../plugins/mailer");
var cache = require("../../plugins/cache");

const activePrefix = "active_account";

exports.register = (req, res) => {
  var entity = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    address: req.body.address,
    district: req.body.district,
    name: req.body.name,
    phone: req.body.phone,
    dob: req.body.dob,
    card_id: req.body.cardID,
    gender: req.body.gender,
    avatar: req.body.avatar,
    role: req.body.role
  };
  if (!entity.email) {
    console.log("Empty email");
    return res.json({
      code: -1,
      message: "Empty email"
    });
  }
  mailer.activateAccount(entity.email, entity.username);
  var key = activePrefix + entity.username;
  var ok = cache.set(key, entity);
  if (!ok) {
    return res.json({
      code: -1,
      message: "System error"
    });
  }
  return res.json({
    code: 1,
    message: "OK"
  });
};
