"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("../mysql"));
var HistoryDB = /** @class */ (function () {
    function HistoryDB() {
        this.db = mysql_1.default;
        this.tableName = "history";
    }
    HistoryDB.prototype.setHistory = function (history, callback) {
        this.db
            .add(this.tableName, history)
            .then(function (data) {
            callback(null, data);
        })
            .catch(function (err) {
            console.log("[HistoryDB][setHistory][err]", err);
            callback(new Error("Set history failed"));
        });
    };
    HistoryDB.prototype.getHistory = function (hisID, callback) {
        this.db
            .get(this.tableName, "id", hisID)
            .then(function (data) {
            callback(null, data);
        })
            .catch(function (err) {
            console.log("[HistoryDB][getHistory][err]", err);
            callback(new Error("Set history failed"));
        });
    };
    return HistoryDB;
}());
exports.HistoryDB = HistoryDB;
