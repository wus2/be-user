"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer_1 = __importDefault(require("nodemailer"));
var config_1 = __importDefault(require("config"));
var Mailer = /** @class */ (function () {
    function Mailer() {
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "ubertutor.wus@gmail.com",
                pass: "hcmus227"
            }
        });
        this.callbackDomain = config_1.default.get("domain");
        this.mail = "ubertutor.wus@gmail.com";
    }
    Mailer.prototype.activateAccount = function (email, username) {
        var url = this.callbackDomain + "/user/activeaccount/" + username;
        var template = "<div>X\u00E1c th\u1EF1c t\u00E0i kho\u1EA3n ubertutor cho <a href=\"mailto:" + email + "\" target=\"_blank\">" + email + "</a><br>\n\n\n        \t\t\t\t\t\t\t\t - T\u00E0i kho\u1EA3n c\u1EE7a b\u1EA1n l\u00E0: <a href=\"mailto:" + email + "\" target=\"_blank\">" + email + "</a><br>\n\n        \t\t\t\t\t\t\t\t - B\u1EA1n vui l\u00F2ng nh\u1EA5p v\u00E0o <a href=\"" + url + "\"> link sau </a> \u0111\u1EC3 k\u00EDch ho\u1EA1t cho t\u00E0i kho\u1EA3n <a href=\"mailto:" + email + "\" target=\"_blank\">" + email + "</a>:<br>\n\n        \t\t\t\t\t\t\t\t - Mail n\u00E0y s\u1EBD h\u1EBFt h\u1EA1n sau 15 ph\u00FAt kh\u00F4ng \u0111\u01B0\u1EE3c x\u00E1c nh\u1EADn<br><br>\n        \t\t\t\t\t\t\t\tL\u01B0u \u00FD: n\u1EBFu b\u1EA1n kh\u00F4ng y\u00EAu c\u1EA7u c\u1EA5p t\u00E0i kho\u1EA3n, vui l\u00F2ng b\u1ECF qua email n\u00E0y v\u00E0 b\u1EA3o m\u1EADt th\u00F4ng tin t\u00E0i kho\u1EA3n c\u1EE7a b\u1EA1n<br>\n\n        \t\t\t\t\t\t\t\t<br><br>\n\n        \t\t\t\t\t\t\t\t\n\n        \t\t\t\t\t\t\t\tVui l\u00F2ng kh\u00F4ng tr\u1EA3 l\u1EDDi email n\u00E0y.<br>\n\n\n        \t\t\t\t\t\t\t\tUber Tutor WUS.<br>\n\n        </div>";
        var opts = {
            from: this.mail,
            to: email,
            subject: "Xác thự tài khoản",
            html: template
        };
        this.transporter.sendMail(opts, function (err, info) {
            if (err) {
                console.log(err);
            }
            console.log("Email sent: " + info);
        });
    };
    Mailer.prototype.updatePass = function (email, id) {
        var url = this.callbackDomain + "/user/confirmchange/" + id;
        var template = "<div>Thay \u0111\u1ED5i m\u1EADt kh\u1EA9u ubertutor cho <a href=\"mailto:" + email + "\" target=\"_blank\">" + email + "</a><br>\n        \t\t\t\t\t\t\t\t - T\u00E0i kho\u1EA3n c\u1EE7a b\u1EA1n l\u00E0: <a href=\"mailto:" + email + "\" target=\"_blank\">" + email + "</a><br>\n\n        \t\t\t\t\t\t\t\t - B\u1EA1n vui l\u00F2ng nh\u1EA5p v\u00E0o <a href=\"" + url + "\"> link sau </a> \u0111\u1EC3  x\u00E1c nh\u1EADn thay \u0111\u1ED5i m\u1EADt kh\u1EA9u cho t\u00E0i kho\u1EA3n <a href=\"mailto:" + email + "\" target=\"_blank\">" + email + "</a>:<br>\n\n        \t\t\t\t\t\t\t\t - Mail n\u00E0y s\u1EBD h\u1EBFt h\u1EA1n sau 15 ph\u00FAt kh\u00F4ng \u0111\u01B0\u1EE3c x\u00E1c nh\u1EADn<br><br>\n        \t\t\t\t\t\t\t\tL\u01B0u \u00FD: n\u1EBFu b\u1EA1n kh\u00F4ng g\u1EEDi y\u00EAu c\u1EA7u n\u00E0y, vui l\u00F2ng b\u1ECF qua email n\u00E0y v\u00E0 b\u1EA3o m\u1EADt th\u00F4ng tin t\u00E0i kho\u1EA3n c\u1EE7a b\u1EA1n<br>\n\n        \t\t\t\t\t\t\t\t<br><br>\n\n        \t\t\t\t\t\t\t\t\n\n        \t\t\t\t\t\t\t\tVui l\u00F2ng kh\u00F4ng tr\u1EA3 l\u1EDDi email n\u00E0y.<br>\n\n\n        \t\t\t\t\t\t\t\tUber Tutor WUS.<br>\n\n        </div>";
        var opts = {
            from: this.mail,
            to: email,
            subject: "Cập nhật mật khẩu",
            html: template
        };
        this.transporter.sendMail(opts, function (err, info) {
            if (err) {
                console.log(err);
            }
            console.log("Email sent: " + info.response);
        });
    };
    Mailer.prototype.forgotPass = function (email, id) {
        var url = this.callbackDomain + "/user/confirmchange/" + id;
        var template = "<div> C\u1EADp nh\u1EADt m\u1EADt kh\u1EA9u ubertutor cho <a href=\"mailto:" + email + "\" target=\"_blank\">" + email + "</a><br>\n        \t\t\t\t\t\t\t\t - T\u00E0i kho\u1EA3n c\u1EE7a b\u1EA1n l\u00E0: <a href=\"mailto:" + email + "\" target=\"_blank\">" + email + "</a><br>\n\n        \t\t\t\t\t\t\t\t - M\u1EADt kh\u1EA9u m\u1EDBi c\u1EE7a b\u1EA1n l\u00E0: 1234566 <br>\n\n        \t\t\t\t\t\t\t\t - B\u1EA1n vui l\u00F2ng nh\u1EA5p v\u00E0o <a href=\"" + url + "\"> link sau </a> \u0111\u1EC3  x\u00E1c nh\u1EADn <br>\n\n        \t\t\t\t\t\t\t\t - Mail n\u00E0y s\u1EBD h\u1EBFt h\u1EA1n sau 15 ph\u00FAt kh\u00F4ng \u0111\u01B0\u1EE3c x\u00E1c nh\u1EADn<br><br>\n        \t\t\t\t\t\t\t\tL\u01B0u \u00FD: n\u1EBFu b\u1EA1n kh\u00F4ng g\u1EEDi y\u00EAu c\u1EA7u n\u00E0y, vui l\u00F2ng b\u1ECF qua email n\u00E0y v\u00E0 b\u1EA3o m\u1EADt th\u00F4ng tin t\u00E0i kho\u1EA3n c\u1EE7a b\u1EA1n<br>\n\n        \t\t\t\t\t\t\t\t<br><br>\n\n        \t\t\t\t\t\t\t\t\n\n        \t\t\t\t\t\t\t\tVui l\u00F2ng kh\u00F4ng tr\u1EA3 l\u1EDDi email n\u00E0y.<br>\n\n\n        \t\t\t\t\t\t\t\tUber Tutor WUS.<br>\n\n        </div>";
        var opts = {
            from: this.mail,
            to: email,
            subject: "Quên mật khẩu",
            html: template
        };
        this.transporter.sendMail(opts, function (err, info) {
            if (err) {
                console.log(err);
            }
            console.log("Email sent: " + info.response);
        });
    };
    return Mailer;
}());
exports.default = Mailer;
