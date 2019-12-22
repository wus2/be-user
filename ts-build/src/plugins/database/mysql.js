"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = __importStar(require("mysql"));
var config_1 = __importDefault(require("config"));
var Mysql = /** @class */ (function () {
    function Mysql() {
        this.pool = mysql.createPool(config_1.default.get("mysql-dev"));
    }
    Mysql.prototype.ping = function () {
        return "Success";
    };
    Mysql.prototype.load = function (sql) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.pool.getConnection(function (err, conn) {
                if (err) {
                    console.log("[mysql][load] err", err);
                    return err;
                }
                conn.query(sql, function (err, results, fields) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(results);
                    }
                });
                conn.release();
                // handle error after release
                if (err) {
                    console.log("[mysql][load] err", err);
                    return err;
                }
            });
        });
    };
    Mysql.prototype.add = function (tableName, entity) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.pool.getConnection(function (err, conn) {
                if (err) {
                    console.log("[mysql][load] err", err);
                    return err;
                }
                var sql = "insert into " + tableName + " set ?";
                conn.query(sql, entity, function (err, value) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(value);
                    }
                });
                conn.release();
                // handle error after release
                if (err) {
                    console.log("[mysql][load] err", err);
                    return err;
                }
            });
        });
    };
    Mysql.prototype.addMultiple = function (tableName, entities, fields) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.pool.getConnection(function (err, conn) {
                if (err) {
                    console.log("[mysql][load] err", err);
                    return err;
                }
                var sql = "insert into " + tableName + " (" + fields + ") values ?";
                conn.query(sql, [entities], function (err, value) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(value);
                    }
                    conn.release();
                    // handle error after release
                    if (err) {
                        console.log("[mysql][load] err", err);
                        return err;
                    }
                });
            });
        });
    };
    Mysql.prototype.get = function (tableName, idField, id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.pool.getConnection(function (err, conn) {
                if (err) {
                    console.log("[mysql][load] err", err);
                    return err;
                }
                var sql = "select * from " + tableName + " where " + idField + " = " + id;
                conn.query(sql, function (err, results, fields) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(results);
                    }
                });
                conn.release();
                // handle error after release
                if (err) {
                    console.log("[mysql][load] err", err);
                    return err;
                }
            });
        });
    };
    Mysql.prototype.update = function (tableName, idField, entity) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.pool.getConnection(function (err, conn) {
                if (err) {
                    console.log("[mysql][update] err", err);
                    return err;
                }
                var id = entity[idField];
                delete entity[idField];
                var sql = "update " + tableName + " set ? where " + idField + " = ?";
                conn.query(sql, [entity, id], function (err, value) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(value.changedRows);
                    }
                });
                conn.release();
                // handle error after release
                if (err) {
                    console.log("[mysql][load] err", err);
                    return err;
                }
            });
        });
    };
    Mysql.prototype.delete = function (tableName, idField, id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.pool.getConnection(function (err, conn) {
                if (err) {
                    console.log("[mysql][delete] err", err);
                    return err;
                }
                var sql = "delete from " + tableName + " where " + idField + " = ?";
                conn.query(sql, id, function (err, value) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(value.affectedRows);
                    }
                });
                conn.release();
                // handle error after release
                if (err) {
                    console.log("[mysql][load] err", err);
                    return err;
                }
            });
        });
    };
    return Mysql;
}());
exports.default = new Mysql();
