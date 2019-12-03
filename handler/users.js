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
          user: {
            ...payload,
            name: user[0].name,
            role: user[0].role
          },
          token
        });
      });
    })(req, res);
  },

  loginViaFB: (req, res, err, user) => {
    if (err) {
      return res.status(200).json({
        code: err.code,
        message: err.message
      });
    }
    if (!user) {
      return res.status(200).json({
        code: -1,
        message: "Emty user data!"
      });
    }
    console.log("[loginViaFB] profile", user);
    models
      .getByUsername(user.id)
      .then(data => {
        if (data[0]) {
          console.log("[passport][authenticate] success", data[0]);

          req.login(data, { session: false }, err => {
            if (err) {
              console.log("[passport][authenticate] err", err);
              return res.json({
                code: -1,
                message: "Login failed"
              });
            }

            var key = config.get("key_jwt");
            const payload = {
              id: data[0].id,
              username: data[0].username
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
              user: {
                ...payload,
                name: data[0].name,
                role: data[0].role
              },
              token
            });
          });
        } else {
          console.error("[passport][facebook] user doesn't login before", err);
          var entity = {
            username: user.id,
            email: user.emails,
            name: user.displayName,
            gender: user.gender,
            role: 2
          };
          models
            .add(entity)
            .then(data => {
              req.login(entity, { session: false }, err => {
                if (err) {
                  console.log("[passport][authenticate] err", err);
                  return res.json({
                    code: -1,
                    message: "Login failed"
                  });
                }

                var key = config.get("key_jwt");
                const payload = {
                  id: entity.id,
                  username: entity.username
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
                  user: {
                    ...payload,
                    name: entity.name,
                    role: entity.role
                  },
                  token
                });
              });
            })
            .catch(err => {
              console.error("[passport][facebook]", err);
              return res.json({
                code: 1,
                message: "Add database failed"
              });
            });
        }
      })
      .catch(err => {
        console.log("[passport][authenticate] err", err);
      });
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
    if (!entity.email) {
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
        console.error("[activateAccount]", err)
        return res.status(400).json({
          code: -1,
          message: "Register failed"
        });
      });
  },
  confirmChange: (req, res) => {
    var key = confirmPrefix + req.params.id;
    console.log("[confirmChange]", key);
    var value = cache.get(key);
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
