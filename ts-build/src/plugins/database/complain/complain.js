"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("../mysql"));
var ComplainDB = /** @class */ (function () {
    function ComplainDB() {
        this.db = mysql_1.default;
        this.tableName = "complain";
    }
    ComplainDB.prototype.setComlain = function (complain, callback) {
        this.db
            .add(this.tableName, complain)
            .then(function (data) {
            if (data) {
                return callback(null, data);
            }
            return callback(new Error("Set complain failed"));
        })
            .catch(function (err) {
            console.log("[ComplainDB][setComplain][err]", err);
            return callback(new Error("Set complain failed"));
        });
    };
    ComplainDB.prototype.getDetailComplain = function (comID, callback) {
        this.db
            .get(this.tableName, "id", comID)
            .then(function (data) {
            if (data && data.length > 0) {
                return callback(null, data);
            }
            return callback(new Error("Get complain failed"));
        })
            .catch(function (err) {
            console.log("[ComplainDB][getComplain][err]", err);
            return callback(new Error("Get complain failed"));
        });
    };
    ComplainDB.prototype.getListComplain = function (offset, limit, callback) {
        var sql = "select * from " + this.tableName + " limit " + offset + ", " + limit;
        this.db
            .load(sql)
            .then(function (data) {
            if (data && data.length > 0) {
                return callback(null, data);
            }
            return callback(new Error("Get list complain failed"));
        })
            .catch(function (err) {
            console.log("[ComplainDB][getListComplain][err]", err);
            return callback(new Error("Get list complain failed"));
        });
    };
    return ComplainDB;
}());
exports.ComplainDB = ComplainDB;
