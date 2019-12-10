var models = require("../../plugins/database/users");
var mailer = require("../../plugins/mailer");
var cache = require("../../plugins/cache");

const confirmPrefix = "confirm_change";

module.exports = {
  profile: (req, res, payload) => {
    var payload = res.locals.payload;
    if (!payload) {
      return res.json({
        code: -1,
        message: "Authenticate failed"
      });
    }
    models
      .getByID(payload.id)
      .then(user => {
        return res.status(200).json({
          code: 1,
          message: "OK",
          data: user[0]
        });
      })
      .catch(err => {
        console.log("[profile][error]", err);
        return res.json({
          code: -1,
          message: err
        });
      });
  },

  updateProfile: (req, res) => {
    var payload = res.locals.payload;
    if (!payload) {
      return res.json({
        code: -1,
        message: "Authenticate failed"
      });
    }
    var entity = {
      id: payload.id,
      address: req.body.address,
      district: req.body.district,
      name: req.body.name,
      phone: req.body.phone,
      dob: req.body.dob,
      gender: req.body.gender,
      price_per_hour: req.body.price
    };

    models
      .update(entity)
      .then(data => {
        return res.status(200).json({
          code: 1,
          message: "OK",
          data: data
        });
      })
      .catch(err => {
        console.log("[updateProfile][error]", err);
        return res.status(500).json({
          code: -1,
          message: "Update profile error"
        });
      });
  },

  updatePassword: (req, res) => {
    var payload = res.locals.payload;
    if (!payload) {
      console.log("[updatePassword][err] authenticate failed");
      return res.json({
        code: -1,
        message: "Authenticate failed"
      });
    }
    var email = req.body.email;
    var password = req.body.password;
    if (!email || !password) {
      return res.json({
        code: -1,
        message: "Email or password is incorrect"
      });
    }
    var entity = {
      id: payload.id,
      email: email,
      password: password
    };
    mailer.forgotPass(entity.email, entity.id);
    var key = confirmPrefix + entity.id;
    var ok = cache.set(key, entity);
    if (!ok) {
      return res.json({
        code: -1,
        message: "System error"
      });
    }
    return res.status(200).json({
      code: 1,
      message: "OK"
    });
  },
  updateAvatar: (req, res) => {
    var payload = res.locals.payload;
    if (!payload) {
      return res.json({
        code: -1,
        message: "Authenticate failed"
      });
    }
    var uri = res.locals.uri;
    console.log("[UpdateAvatar][uri]", uri);
    if (!uri) {
      console.log("[updateAvatar][err] image path is null");
      return res.json({
        code: -1,
        message: "Update database failed"
      });
    }
    var entity = {
      id: payload.id,
      avatar: uri
    };
    models
      .update(entity)
      .then(data => {
        console.log("[UpdateAvatar][data]", data);
        if (data) {
          return res.status(200).json({
            code: 1,
            message: "OK"
          });
        }
        return res.json({
          code: -1,
          message: "Update database failed"
        });
      })
      .catch(err => {
        console.log("[uploadImage][error]", err);
        return res.json({
          code: -1,
          message: "Update database failed"
        });
      });
  }
};
