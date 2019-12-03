var models = require("../plugins/database/users");
var mailer = require("../plugins/mailer");
var cache = require("../plugins/cache");

const confirmPrefix = "confirm_change";

module.exports = {
  profile: (req, res, payload) => {
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
        return res.json({
          code: -1,
          message: err
        });
      });
  },

  updateProfile: (req, res, payload) => {
    var entity = {
      id: payload.id,
      address: req.body.address,
      name: req.body.name,
      phone: req.body.phone,
      dob: req.body.dob,
      gender: req.body.gender,
      avatar: req.body.avatar
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
        // log err
        return res.status(500).json({
          code: -1,
          message: "Update profile error"
        });
      });
  },

  updatePassword: (req, res, payload) => {
    var entity = {
      id: payload.id,
      email: req.body.email,
      password: req.body.password
    };
    mailer.forgotPass(entity.email, entity.id);
    var key = confirmPrefix + entity.id;
    var ok = cache.set(key, entity);
    if (!ok) {
      return res.status(400).json({
        code: -1,
        message: "System error"
      });
    }
    return res.status(200).json({
      code: 1,
      message: "OK"
    });
  },
  updateAvatar: (req, res, payload) => {
    var uri = res.locals.uri;
    if (!uri) {
      console.log("[updateAvatar][err] image path is null");
      return res.status(400).json({
        code: -1,
        message: "Update database failed"
      });
    }
    var entity = {
      id: 22,
      avatar: uri
    };
    models
      .update(entity)
      .then(data => {
        return res.status(200).json({
          code: 1,
          message: "OK"
        });
      })
      .catch(err => {
        console.log("[uploadImage][error]", err);
        return res.status(400).json({
          code: -1,
          message: "Update database failed"
        });
      });
  }
};
