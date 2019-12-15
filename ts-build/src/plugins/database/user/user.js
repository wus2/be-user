"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("../mysql"));
var UserDB = /** @class */ (function () {
    function UserDB() {
        this.db = mysql_1.default;
        this.tableName = "user";
    }
    UserDB.prototype.setUser = function (user, callback) {
        this.db
            .add(this.tableName, user)
            .then(function (data) {
            if (data) {
                return callback(null, data);
            }
            return callback(new Error("Set user failed"));
        })
            .catch(function (err) {
            console.log("[UserDB][setUser][err]", err);
            return callback(new Error("Set user failed"));
        });
    };
    UserDB.prototype.getByID = function (userID, callback) {
        var sql = "select * from user where id = " + userID;
        this.db
            .load(sql)
            .then(function (data) {
            if (data) {
                return callback(null, data);
            }
            return callback(new Error("Get user failed"));
        })
            .catch(function (err) {
            console.log("[UserDB][getByID][err]", err);
            return callback(new Error("Get user failed"));
        });
    };
    UserDB.prototype.getValidUser = function (username, password, callback) {
        var sql = "select * from user where username = '" + username + "' and password = '" + password + "'";
        this.db
            .load(sql)
            .then(function (data) {
            if (data) {
                return callback(null, data);
            }
            return callback(new Error("User is invalid"));
        })
            .catch(function (err) {
            console.log("[UserDB][getValidUser][err]", err);
            return callback(new Error("Get valid user is failed"));
        });
    };
    UserDB.prototype.getByUsername = function (username, callback) {
        var sql = "select * from user where username = '" + username;
        this.db
            .load(sql)
            .then(function (data) {
            if (data) {
                return callback(null, data);
            }
            return callback(new Error("Get database failed"));
        })
            .catch(function (err) {
            console.log("[UserDB][getByUsername][err]", err);
            return callback(new Error("Get database failed"));
        });
    };
    UserDB.prototype.getListUsers = function (offset, limit, callback) {
        if (offset < 0 || limit < 0) {
            return callback(new Error("Offset or limit is incorrect"));
        }
        var sql = "select * from " + this.tableName + " limit " + offset + ", " + limit;
        this.db
            .load(sql)
            .then(function (data) {
            if (data) {
                return callback(null, data);
            }
            return callback(new Error("List user is empty"));
        })
            .catch(function (err) {
            console.log("[UserDB][getListUser][err]", err);
            return callback(new Error("Get list user failed"));
        });
    };
    UserDB.prototype.updateUser = function (user, callback) {
        this.db
            .update(this.tableName, "id", user)
            .then(function (data) {
            if (data) {
                return callback(null, data);
            }
            return callback(new Error("Update user failed"));
        })
            .catch(function (err) {
            console.log("[UserDB][updateUser][err]", err);
            return callback(new Error("Set user failed"));
        });
    };
    return UserDB;
}());
exports.default = UserDB;