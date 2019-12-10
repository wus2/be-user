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
    return res.json({
      code: -1,
      message: "Active account expired"
    });
  }
  cache.delete(key);

  console.log("VALUE", value);

  models
    .add(value)
    .then(id => {
      if (id) {
        return res.redirect(config.get("redirect"));
      }
      return res.json({
        code: -1,
        message: "Add to database failed"
      });
    })
    .catch(err => {
      console.error("[activateAccount]", err);
      return res.json({
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
    return res.json({
      code: -1,
      message: "Confirm change expired"
    });
  }
  cache.delete(key);

  models
    .update(value)
    .then(data => {
      console.log(data);
      return res.redirect(config.get("redirect"));
    })
    .catch(err => {
      console.log("[ConfirmChange][err]", err);
      return res.status(500).json({
        code: -1,
        message: "Update password error"
      });
    });
};
