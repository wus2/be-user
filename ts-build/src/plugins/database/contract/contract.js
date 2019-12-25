"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("../mysql"));
var user_1 = require("../user/user");
var ContractStatus;
(function (ContractStatus) {
    ContractStatus[ContractStatus["Draft"] = 0] = "Draft";
    ContractStatus[ContractStatus["Pending"] = 1] = "Pending";
    ContractStatus[ContractStatus["Approved"] = 2] = "Approved";
    ContractStatus[ContractStatus["Created"] = 3] = "Created";
    ContractStatus[ContractStatus["Bought"] = 4] = "Bought";
    ContractStatus[ContractStatus["Closed"] = 5] = "Closed";
    ContractStatus[ContractStatus["Refund"] = 6] = "Refund";
    ContractStatus[ContractStatus["Expired"] = 7] = "Expired";
    ContractStatus[ContractStatus["Finished"] = 8] = "Finished";
})(ContractStatus = exports.ContractStatus || (exports.ContractStatus = {}));
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
            .get(this.tableName, "cid", conID)
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
    ContractDB.prototype.getContractViaRole = function (conID, role, callback) {
        var sql = "";
        if (role == user_1.Role.Tutee) {
            sql = "SELECT * FROM contract AS C JOIN user AS U ON C.tutor_id = U.id WHERE C.cid = " + conID;
        }
        else if (role == user_1.Role.Tutor) {
            sql = "SELECT * FROM contract AS C JOIN user AS U ON C.tutee_id = U.id WHERE C.cid = " + conID;
        }
        console.log(sql);
        this.db
            .load(sql)
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
            .update(this.tableName, "cid", contract)
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
    ContractDB.prototype.getListContract = function (userID, role, offset, limit, callback) {
        if (offset < 0 || limit < 0) {
            return callback(new Error("Offset or limit is incorrect"));
        }
        if (userID < 0 || !isValidRole(role)) {
            return callback(new Error("UserID or role is invalid"));
        }
        console.log(role);
        var sql = "select * from " + this.tableName;
        if (role == user_1.Role.Tutor) {
            sql += " where tutor_id = " + userID;
        }
        else if (role == user_1.Role.Tutee) {
            sql += " where tutee_id = " + userID;
        }
        sql += " limit " + offset + ", " + limit;
        console.log(sql);
        this.db
            .load(sql)
            .then(function (data) {
            if (!data) {
                return callback(new Error("Get list contract is in correct"));
            }
            if (data.length < 0) {
                return callback(new Error("List contract is empty"));
            }
            return callback(null, data);
        })
            .catch(function (err) {
            console.log("[ContractDB][getListContract][err]", err);
            return callback(new Error("Get list contract is incorrect"));
        });
    };
    ContractDB.prototype.getListContractWithUserInfo = function (userID, role, offset, limit, callback) {
        if (offset < 0 || limit < 0) {
            return callback(new Error("Offset or limit is incorrect"));
        }
        if (userID < 0 || !isValidRole(role)) {
            return callback(new Error("UserID or role is invalid"));
        }
        var sql = "";
        if (role == user_1.Role.Tutee) {
            sql = "SELECT * FROM contract AS C JOIN user AS U ON C.tutor_id = U.id";
        }
        else if (role == user_1.Role.Tutor) {
            sql = "SELECT * FROM contract AS C JOIN user AS U ON C.tutee_id = U.id";
        }
        if (role == user_1.Role.Tutor) {
            sql += " where tutor_id = " + userID;
        }
        else if (role == user_1.Role.Tutee) {
            sql += " where tutee_id = " + userID;
        }
        sql += " limit " + offset + ", " + limit;
        console.log(sql);
        this.db
            .load(sql)
            .then(function (data) {
            if (!data) {
                return callback(new Error("Get list contract is in correct"));
            }
            if (data.length < 0) {
                return callback(new Error("List contract is empty"));
            }
            return callback(null, data);
        })
            .catch(function (err) {
            console.log("[ContractDB][getListContract][err]", err);
            return callback(new Error("Get list contract is incorrect"));
        });
    };
    ContractDB.prototype.getContractByOrderID = function (orderID, callback) {
        var sql = "select * from " + this.tableName + " where order_id = " + orderID;
        this.db
            .load(sql)
            .then(function (data) {
            if (!data || data.length < 0) {
                return callback(new Error("Contract is empty"));
            }
            return callback(null, data);
        })
            .catch(function (err) {
            console.log("[ContractDB][getContractByOrderID][err]", err);
            return callback(new Error("Get contract failed"));
        });
    };
    ContractDB.prototype.getListUserContract = function (offset, limit, callback) {
        var sql = "select * from " + this.tableName + " limit " + offset + ", " + limit;
        this.db
            .load(sql)
            .then(function (data) {
            if (!data || data.length < 0) {
                return callback(new Error("Contract list is empty"));
            }
            return callback(null, data);
        })
            .catch(function (err) {
            console.log("[ContractDB][getContractByOrderID][err]", err);
            return callback(new Error("Get list contract failed"));
        });
    };
    ContractDB.prototype.getRateResultInContract = function (tutorID, offset, limit, callback) {
        var sql = "SELECT U.name, C.stars, C.comment FROM contract AS C JOIN user AS U ON C.tutee_id = U.id WHERE tutor_id = " + tutorID + " AND C.stars IS NOT NULL AND C.comment IS NOT NULL LIMIT " + offset + ", " + limit;
        this.db
            .load(sql)
            .then(function (data) {
            if (data && data.length > 0) {
                return callback(null, data);
            }
            return callback(new Error("List rate results is empty"));
        })
            .catch(function (err) {
            console.log("[ContractDB][getRateResultInContract][err]", err);
            return callback(new Error("List rate results is empty"));
        });
    };
    ContractDB.prototype.reveneuForTutor = function (tutorID, start, end, callback) {
        var sql = "SELECT order_create_date as create_time, order_amount as amount FROM contract WHERE tutor_id = " + tutorID + " AND order_create_date >= " + start + " AND order_create_date <= " + end;
        this.db
            .load(sql)
            .then(function (data) {
            if (data && data.length > 0) {
                return callback(null, data);
            }
            return callback(new Error("Data is empty"));
        })
            .catch(function (err) {
            console.log("[ContractDB][getRateResultInContract][err]", err);
            return callback(new Error("Get data error"));
        });
    };
    return ContractDB;
}());
exports.ContractDB = ContractDB;
function isValidRole(role) {
    return !(role != user_1.Role.Tutee && role != user_1.Role.Tutor);
}
