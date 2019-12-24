"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("../mysql"));
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus[NotificationStatus["NotSeen"] = 1] = "NotSeen";
    NotificationStatus[NotificationStatus["Seen"] = 2] = "Seen";
})(NotificationStatus = exports.NotificationStatus || (exports.NotificationStatus = {}));
var NotificationDB = /** @class */ (function () {
    function NotificationDB() {
        this.db = mysql_1.default;
        this.tableName = "notification";
    }
    NotificationDB.prototype.setNotification = function (notification, callback) {
        this.db
            .add(this.tableName, notification)
            .then(function (data) {
            if (data) {
                return callback(null, data);
            }
            return callback(new Error("Set database failed"));
        })
            .catch(function (err) {
            console.log("[NotificationDB][setNotification][err]", err);
            return callback(new Error("Set database failed"));
        });
    };
    NotificationDB.prototype.getNotification = function (notiID, callback) {
        this.db
            .get(this.tableName, "id", notiID)
            .then(function (data) {
            if (data.length > 0) {
                return callback(null, data);
            }
            return callback(new Error("Notification empty"));
        })
            .catch(function (err) {
            console.log("[NotificationDB][getNotification][err]", err);
            return callback(new Error("Notification empty"));
        });
    };
    NotificationDB.prototype.getListNotification = function (userID, offset, limit, callback) {
        var sql = "select * from " + this.tableName + " where user_id = " + userID + " limit " + offset + ", " + limit;
        this.db
            .load(sql)
            .then(function (data) {
            if (data.length > 0) {
                return callback(null, data);
            }
            return callback(new Error("Notification empty"));
        })
            .catch(function (err) {
            console.log("[NotificationDB][getListNotification][err]", err);
            return callback(new Error("Notification empty"));
        });
    };
    NotificationDB.prototype.setSeen = function (notiID, callback) {
        var entity = {
            id: notiID,
            status: NotificationStatus.Seen
        };
        this.db
            .update(this.tableName, "id", entity)
            .then(function (data) {
            if (data > 0) {
                return callback(null, data);
            }
            return callback(new Error("Update failed"));
        })
            .catch(function (err) {
            console.log("[NotificationDB][setSeen][err]", err);
            return callback(new Error("Update failed"));
        });
    };
    return NotificationDB;
}());
exports.NotificationDB = NotificationDB;
