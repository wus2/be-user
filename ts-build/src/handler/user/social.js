"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = __importDefault(require("config"));
var usernameFBPrefix = "facebook_";
function LoginViaFB(req, res) {
    var _this = this;
    passport_1.default.authenticate("facebook", {
        session: false
    }, function (err, user, info) {
        if (err) {
            return res.json({
                code: err.code,
                message: err.toString().message
            });
        }
        if (!user) {
            return res.json({
                code: -1,
                message: "Emty user data!"
            });
        }
        _this.userDB.getByUsername(usernameFBPrefix + user.id, function (err, data) {
            if (err) {
                var entity = {
                    username: usernameFBPrefix + user.id,
                    email: user.emails,
                    name: user.displayName,
                    gender: user.gender,
                    role: 0
                };
                _this.userDB.setUser(entity, function (err, data) {
                    if (err) {
                        console.log("[passport][authenticate] err", err);
                        return res.json({
                            code: -1,
                            message: "Login failed"
                        });
                    }
                    login(req, res, data);
                });
            }
            login(req, res, data[0]);
        });
    })(req, res);
}
exports.LoginViaFB = LoginViaFB;
var usernameGGPrefix = "google_";
function LoginViaGG(req, res) {
    var _this = this;
    passport_1.default.authenticate("google", {
        session: false
    }, function (err, user, info) {
        if (err) {
            return res.json({
                code: err.code,
                message: err.toString().message
            });
        }
        if (!user) {
            return res.json({
                code: -1,
                message: "Emty user data!"
            });
        }
        _this.userDB.getByUsername(usernameGGPrefix + user.id, function (err, data) {
            if (err) {
                var entity = {
                    username: usernameGGPrefix + user.id,
                    email: user.emails,
                    name: user.displayName,
                    gender: user.gender,
                    role: 0
                };
                _this.userDB.setUser(entity, function (err, data) {
                    if (err) {
                        console.log("[passport][authenticate] err", err);
                        return res.json({
                            code: -1,
                            message: "Login failed"
                        });
                    }
                    login(req, res, data);
                });
            }
            login(req, res, data[0]);
        });
    })(req, res);
}
exports.LoginViaGG = LoginViaGG;
function login(req, res, data) {
    req.login(data, { session: false }, function (err) {
        if (err) {
            console.log("[login] err", err);
            return res.json({
                code: -1,
                message: "Login failed"
            });
        }
        var key = config_1.default.get("key_jwt");
        var payload = {
            id: data.id,
            username: data.username,
            role: data.role
        };
        var token = jsonwebtoken_1.default.sign(payload, key);
        if (!token) {
            return res.json({
                code: -1,
                message: "Can't sign token"
            });
        }
        var params = JSON.stringify({
            code: 1,
            message: "OK",
            user: __assign(__assign({}, payload), { avatar: data.avatar, name: data.name, role: data.role }),
            token: token
        });
        return res.redirect("http://112.197.2.178:8004?params=" + params);
    });
}
