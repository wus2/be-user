"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("../mysql"));
var Status;
(function (Status) {
    Status[Status["Draft"] = 0] = "Draft";
    Status[Status["Pending"] = 1] = "Pending";
    Status[Status["Approved"] = 2] = "Approved";
    Status[Status["Closed"] = 3] = "Closed";
    Status[Status["Expired"] = 4] = "Expired";
})(Status = exports.Status || (exports.Status = {}));
var ContractDB = /** @class */ (function () {
    function ContractDB() {
        this.db = mysql_1.default;
        this.tableName = "contract";
    }
    ContractDB.prototype.setContract = function (contract, callback) {
        this.db
            .add(this.tableName, contract)
            .then(function (data) {
            if (data) {
                return callback(null, data);
            }
            return callback(new Error("Set contract failed"));
        })
            .catch(function (err) {
            console.log("[ContractDB][setContract][err]", err);
            return callback(new Error("Set contract failed"));
        });
    };
    ContractDB.prototype.getContract = function (conID, callback) {
        this.db
            .get(this.tableName, "id", conID)
            .then(function (data) {
            if (data) {
                return callback(null, data);
            }
            return callback(new Error("Get contract failed"));
        })
            .catch(function (err) {
            console.log("[ContractDB][getContract][err]", err);
            return callback(new Error("Get Contract failed"));
        });
    };
    ContractDB.prototype.updateContract = function (contract, callback) {
        this.db
            .update(this.tableName, "id", contract)
            .then(function (data) {
            if (data < 0) {
                return callback(new Error("Update database failed"));
            }
            return callback(null, data);
        })
            .catch(function (err) {
            console.log("[ContractDB][updateContract][err]", err);
            return callback(new Error("Update database failed"));
        });
    };
    return ContractDB;
}());
exports.ContractDB = ContractDB;
