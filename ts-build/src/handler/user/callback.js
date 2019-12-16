"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("config"));
var activePrefix = "active_account";
var confirmPrefix = "confirm_change";
function ActivateAccount(req, res) {
    var key = activePrefix + req.params.username;
    console.log("[activateAccount]", key);
    var value = this.cache.get(key);
    if (value == undefined) {
        return res.json({
            code: -1,
            message: "Active account expired"
        });
    }
    this.cache.delete(key);
    var model = value;
    if (!model) {
        console.log("[ActivateAccount][err] cast to model error", value);
        return res.json({
            code: -1,
            message: "Register failed"
        });
    }
    this.userDB.setUser(model, function (err, data) {
        if (err) {
            console.error("[ActivateAccount]", err);
            return res.json({
                code: -1,
                message: "Register failed"
            });
        }
        return res.redirect(config_1.default.get("redirect"));
    });
}
exports.ActivateAccount = ActivateAccount;
function ConfirmChange(req, res) {
    var key = confirmPrefix + req.params.id;
    console.log("[confirmChange]", key);
    var value = this.cache.get(key);
    console.log(value);
    if (value == undefined) {
        return res.json({
            code: -1,
            message: "Confirm change expired"
        });
    }
    this.cache.delete(key);
    var model = value;
    if (!model) {
        console.log("[ConfirmChange][err] cast to model error", value);
        return res.json({
            code: -1,
            message: "Update password failed"
        });
    }
    this.userDB.updateUser(model, function (err, data) {
        if (err) {
            console.error("[ConfirmChange]", err);
            return res.json({
                code: -1,
                message: "Update password failed"
            });
        }
        return res.redirect(config_1.default.get("redirect"));
    });
}
exports.ConfirmChange = ConfirmChange;
function ReclaimPassword(req, res) {
}
exports.ReclaimPassword = ReclaimPassword;
