"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var confirmPrefix = "confirm_change";
function GetProfile(req, res) {
    var payload = res.locals.payload;
    this.userDB.getByID(payload.id, function (err, data) {
        if (err) {
            return res.json({
                code: -1,
                message: err.toString()
            });
        }
        if (data[0].skill_tags) {
            data[0].skill_tags = JSON.parse(data[0].skill_tags);
        }
        return res.status(200).json({
            code: 1,
            message: "OK",
            data: data[0]
        });
    });
}
exports.GetProfile = GetProfile;
function UpdateProfile(req, res) {
    var payload = res.locals.payload;
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
    this.userDB.updateUser(entity, function (err, data) {
        if (err) {
            return res.status(200).json({
                code: -1,
                message: err.toString()
            });
        }
        return res.status(200).json({
            code: 1,
            message: "OK"
        });
    });
}
exports.UpdateProfile = UpdateProfile;
function UpdatePassword(req, res) {
    var payload = res.locals.payload;
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
    this.mailer.updatePass(entity.email, entity.id);
    var key = confirmPrefix + entity.id;
    var ok = this.cache.set(key, entity);
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
}
exports.UpdatePassword = UpdatePassword;
function ForgotPassword(req, res) {
    var _this = this;
    var email = req.body.email;
    if (!email) {
        return res.json({
            code: -1,
            message: "Email is incorrect"
        });
    }
    this.userDB.getByEmail(email, function (err, data) {
        if (err) {
            return res.json({
                code: -1,
                message: err.toString()
            });
        }
        var user = data[0];
        if (!user) {
            return res.json({
                code: -1,
                message: "Data is not user model"
            });
        }
        if (!user.id) {
            return res.json({
                code: -1,
                message: "User is not correct"
            });
        }
        var entity = {
            id: user.id,
            email: email,
            password: "123456"
        };
        _this.mailer.forgotPass(email, user.id);
        var key = confirmPrefix + user.id;
        var ok = _this.cache.set(key, entity);
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
    });
}
exports.ForgotPassword = ForgotPassword;
function UpdateAvatar(req, res) {
    var payload = res.locals.payload;
    console.log(payload);
    var uri = res.locals.uri;
    console.log("[UpdateAvatar][uri]", uri);
    if (!uri) {
        console.log("[updateAvatar][err] image path is null");
        return res.json({
            code: -1,
            message: "Update database failed"
        });
    }
    console.log("========================");
    var entity = {
        id: payload.id,
        avatar: uri
    };
    if (!entity) {
        return res.json({
            code: -1,
            message: "User model is incorrect"
        });
    }
    this.userDB.updateUser(entity, function (err, data) {
        if (err) {
            return res.json({
                code: -1,
                message: err.toString()
            });
        }
        return res.status(200).json({
            code: 1,
            message: "OK"
        });
    });
}
exports.UpdateAvatar = UpdateAvatar;
