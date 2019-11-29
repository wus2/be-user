var passport = require("passport");
var jwt = require("jsonwebtoken");
var config = require("config");

var models = require("../plugins/database/users");

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

    models
      .add(entity)
      .then(id => {
        return res.json({
          code: 1,
          message: "OK"
        });
      })
      .catch(err => {
        // log err
        return res.json({
          code: -1,
          message: "Register failed"
        });
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
        password: req.body.password
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
            message: "Update password error"
          });
        });
    })(req, res);
  }
};
