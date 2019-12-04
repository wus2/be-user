var passport = require('passport')
var jwt = require("jsonwebtoken");
var config = require("config");

var models = require("../plugins/database/users");

const usernamePrefix = "google_"

exports.loginViaGG = (req, res) => {
    passport.authenticate(
        "google",
        {
            session: false
        },
        (err, user, info) => {
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
            console.log("[loginViaGG] profile", user);
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
                        console.error(
                            "[passport][facebook] user doesn't login before",
                            err
                        );
                        var entity = {
                            username: user.id,
                            email: user.emails[0].verified ? "" : user.emails[0].value,
                            name: user.displayName,
                            gender: user.gender,
                            avatar: user.photos[0].value,
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
                }).catch(err => {
                    console.log("[passport][authenticate] err", err);
                })
        })(req, res)
}