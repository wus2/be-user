var models = require("../../plugins/database/users");
var cache = require("../../plugins/cache");
var config = require("config");

const activePrefix = "active_account";
const confirmPrefix = "confirm_change";

exports.activateAccount = (req, res) => {
  var key = activePrefix + req.params.username;
  console.log("[activateAccount]", key);
  var value = cache.get(key);
  if (value == undefined) {
    return res.status(400).json({
      code: -1,
      message: "Active account expired"
    });
  }
  cache.delete(key);

  console.log("VALUE", value);

  models
    .add(value)
    .then(id => {
      return res.status(200).json({
        code: 1,
        message: "OK"
      });
    })
    .catch(err => {
      console.error("[activateAccount]", err);
      return res.status(400).json({
        code: -1,
        message: "Register failed"
      });
    });
};

exports.confirmChange = (req, res) => {
  var key = confirmPrefix + req.params.id;
  console.log("[confirmChange]", key);
  var value = cache.get(key);
  console.log(value);
  if (value == undefined) {
    return res.status(400).json({
      code: -1,
      message: "Confirm change expired"
    });
  }
  cache.delete(key);

  models
    .update(value)
    .then(data => {
      if (data) {
        res.redirect(config.get("redirect"));
      }
      return res.status(400).json({
        code: -1,
        message: "Update failed"
      });
    })
    .catch(err => {
      console.log("[ConfirmChange][err]", err);
      return res.status(500).json({
        code: -1,
        message: "Update password error"
      });
    });
};
