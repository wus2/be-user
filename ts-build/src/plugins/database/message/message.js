"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("../mysql"));
var MessageDB = /** @class */ (function () {
    function MessageDB() {
        this.db = mysql_1.default;
        this.tableName = "message";
    }
    MessageDB.prototype.setMessage = function (entity, callback) {
        this.db
            .add(this.tableName, entity)
            .then(function (data) {
            if (data) {
                return callback(null, data);
            }
            return callback(new Error("Set message failed"));
        })
            .catch(function (err) {
            console.log("[MessageDB][setMessage][err]", err);
            return callback(new Error("Set message failed"));
        });
    };
    MessageDB.prototype.getMessageHistory = function (room, offset, limit, callback) {
        if (!room) {
            return callback(new Error("Room is empty"));
        }
        if (offset < 0 || limit < 0) {
            return callback(new Error("Offset or limit is incorrect"));
        }
        var sql = "SELECT sender_id, sender_name, receiver_id, receiver_name, message FROM " + this.tableName + " limit " + offset + ", " + limit;
        this.db
            .load(sql)
            .then(function (data) {
            if (!data) {
                return callback(new Error("Get message history failed"));
            }
            if (data.length < 0) {
                return callback(new Error("Get message history failed"));
            }
            callback(null, data);
        })
            .catch(function (err) {
            console.log("[MessageDB][getMessageHistory][err]", err);
            return callback(new Error("Get message history failed"));
        });
    };
    MessageDB.prototype.getRoom = function (senderID, receiverID) {
        return "";
    };
    MessageDB.prototype.checkRoomExists = function (senderID, receiverID) {
        return true;
    };
    MessageDB.prototype.generateRoom = function (senderID, receiverID) {
        return "";
    };
    return MessageDB;
}());
exports.MessageDB = MessageDB;
