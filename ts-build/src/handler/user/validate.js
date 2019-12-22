"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ValidateUsername(req, res) {
    var username = req.params.username;
    if (username.length <= 0) {
        return res.json({
            code: -1,
            message: "Empty username"
        });
    }
    this.userDB.validateUsername(username, function (err, ok) {
        if (err) {
            return res.json({
                code: -1,
                message: err.toString()
            });
        }
        if (ok) {
            return res.json({
                code: -1,
                message: "Username existed",
                existed: true
            });
        }
        return res.status(200).json({
            code: 1,
            message: "OK",
            existed: false
        });
    });
}
exports.ValidateUsername = ValidateUsername;
function ValidatePassword(req, res) {
    var password = req.body.password;
    if (password.length <= 0) {
        return res.json({
            code: -1,
            message: "Username or password is incorrect"
        });
    }
    var payload = res.locals.payload;
    if (!payload) {
        return res.json({
            code: -1,
            message: "User payload is empty"
        });
    }
    this.userDB.getByID(payload.id, function (err, data) {
        if (err) {
            return res.json({
                code: -1,
                message: err.toString()
            });
        }
        var user = data[0];
        if (!user.password) {
            return res.json({
                code: -1,
                message: "Data is not a user model"
            });
        }
        if (password !== user.password) {
            return res.json({
                code: -1,
                message: "Incorrect password"
            });
        }
        return res.status(200).json({
            code: 1,
            message: "OK"
        });
    });
}
exports.ValidatePassword = ValidatePassword;
