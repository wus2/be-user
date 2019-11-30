var passport = require("passport");
var jwt = require("jsonwebtoken");
var config = require("config");

var models = require("../plugins/database/users");
var mailer = require("../plugins/mailer");
var cache = require("../plugins/cache");

const activePrefix = "active_account";
const confirmPrefix = "confirm_change";

module.exports = {
  login: (req, res) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          code: 400,
          message: info ? info.message : "Login failed"
        });
      }

      req.login(user, { session: false }, err => {
        if (err) {
          // log err
          return res.json({
            code: -1,
            message: "Login failed"
          });
        }

        var key = config.get("key_jwt");
        const payload = {
          id: user[0].id,
          username: user[0].username
        };
        var token = jwt.sign(payload, key);
        if (!token) {
          return res.json({
            code: -1,
            message: "Can't sign token"
          });
        }
        return res.json({
          code: 1,
          message: "OK",
          payload,
          token
        });
      });
    })(req, res);
  },

  register: (req, res) => {
    var entity = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      address: req.body.address,
      name: req.body.name,
      phone: req.body.phone,
      dob: req.body.dob,
      card_id: req.body.cardID,
      gender: req.body.gender,
      avatar: req.body.avatar,
      role: req.body.role
    };
    if (entity.email === "" || entity.email === undefined) {
      console.log("Empty email");
      return res.status(400).json({
        code: -1,
        message: "Empty email"
      });
    }
    mailer.activateAccount(entity.email, entity.username);
    var key = activePrefix + entity.username;
    var ok = cache.set(key, entity);
    if (!ok) {
      return res.status(400).json({
        code: -1,
        message: "System error"
      });
    }
    return res.json({
      code: 1,
      message: "OK"
    });
  },

  profile: (req, res) => {
    passport.authenticate("jwt", { session: false }, payload => {
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
    })(req, res);
  },

  updateProfile: (req, res) => {
    passport.authenticate("jwt", { session: false }, payload => {
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
    })(req, res);
  },

  updatePassword: (req, res) => {
    passport.authenticate("jwt", { session: false }, payload => {
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
    })(req, res);
  },
  activateAccount: (req, res) => {
    var key = activePrefix + req.params.username;
    console.log("[activateAccount]", key);
    var value = cache.get(key);
    if (value == undefined) {
      return res.status(400).json({
        code: -1,
        message: "Active account expired"
      });
    }
    models
      .add(value)
      .then(id => {
        return res.status(200).json({
          code: 1,
          message: "OK"
        });
      })
      .catch(err => {
        // log err
        return res.status(400).json({
          code: -1,
          message: "Register failed"
        });
      });
  },
  confirmChange: (req, res) => {
    var key = confirmPrefix + req.params.id
    console.log("[confirmChange]", key);
    var value = cache.get(key)
    if (value == undefined) {
      return res.status(400).json({
        code: -1,
        message: "Confirm change expired"
      })
    }
    
    models
      .update(value)
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
          message: "Update password error"
        });
      });
  }
};
