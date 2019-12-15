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
function Login(req, res, next) {
    passport_1.default.authenticate("local", { session: false }, function (err, user, info) {
        if (err || !user) {
            return res.json({
                code: 400,
                message: info ? info.message : "Login failed"
            });
        }
        req.login(user, { session: false }, function (err) {
            if (err) {
                console.log("[Login][err]", err);
                return res.json({
                    code: -1,
                    message: "Login failed"
                });
            }
            var key = config_1.default.get("key_jwt");
            var payload = {
                id: user[0].id,
                username: user[0].username,
                role: user[0].role
            };
            var token = jsonwebtoken_1.default.sign(payload, key);
            if (!token) {
                return res.json({
                    code: -1,
                    message: "Can't sign token"
                });
            }
            return res.json({
                code: 1,
                message: "OK",
                user: __assign(__assign({}, payload), { avatar: user[0].avatar, name: user[0].name, role: user[0].role }),
                token: token
            });
        });
    })(req, res, next);
}
exports.Login = Login;
