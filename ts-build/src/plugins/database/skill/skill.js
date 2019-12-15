"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("../mysql"));
var SkillDB = /** @class */ (function () {
    function SkillDB() {
        this.db = mysql_1.default;
        this.tableName = "skill_tags";
    }
    SkillDB.prototype.warmUp = function (limit, callback) {
        var sql = "select * from " + this.tableName;
        if (limit != Infinity) {
            sql += " limit " + limit;
        }
        this.db
            .load(sql)
            .then(function (data) {
            if (data && data.length > 0) {
                return callback(null, data);
            }
            return callback(new Error("Skill is empty"));
        })
            .catch(function (err) {
            console.log("[SkillDB][warmup][err]", err);
            return callback(new Error("Cannot get skill"));
        });
    };
    SkillDB.prototype.addMultipleSkill = function (skills, callback) {
        if (skills.length > 0) {
            this.db
                .addMultiple(this.tableName, skills, "tag")
                .then(function (data) {
                if (data) {
                    callback(null, data);
                }
                callback(new Error("Add failed"));
            })
                .catch(function (err) {
                console.log("[SkillTags][updateSkill][err]", err);
                callback(new Error("Add failed"));
            });
        }
    };
    SkillDB.prototype.addSkill = function (entity, callback) {
        if (!entity) {
            return callback(new Error("Skill is empty!"));
        }
        this.db
            .add(this.tableName, entity)
            .then(function (data) {
            if (data) {
                return callback(null, data);
            }
            return callback(new Error("Add skill failed"));
        })
            .catch(function (err) {
            console.log("[SkillDB][addSkill][err]", err);
            return callback(new Error("Add skill failed"));
        });
    };
    SkillDB.prototype.getSkill = function (skillID, callback) {
        if (skillID < 0) {
            return callback(new Error("ID is incorrect"));
        }
        var sql = "select * from " + this.tableName + " where id = " + skillID;
        this.db
            .load(sql)
            .then(function (data) {
            if (data && data.length > 0) {
                return callback(null, data);
            }
            return callback(new Error("Skill is empty"));
        })
            .catch(function (err) {
            console.log("[SkillDB][getSkills][err]", err);
            return callback(new Error("Load from db error"));
        });
    };
    SkillDB.prototype.getSkills = function (offset, limit, callback) {
        if (offset < 0 || limit < 0) {
            return callback(new Error("offset and limit is error"));
        }
        var sql = "select * from " + this.tableName + " limit " + offset + ", " + limit;
        this.db
            .load(sql)
            .then(function (data) {
            return callback(null, data);
        })
            .catch(function (err) {
            console.log("[SkillDB][getSkills][err]", err);
            return callback(new Error("load from db error"));
        });
    };
    SkillDB.prototype.updateSkill = function (skillID, entity, callback) {
        if (!entity || !skillID) {
            return callback(new Error("Empty skill"));
        }
        this.db
            .update(this.tableName, "id", entity)
            .then(function (data) {
            if (data) {
                return callback(null, data);
            }
            return callback(new Error("Update failed"));
        })
            .catch(function (err) {
            console.log("[SkillDB][updateSkill][err]", err);
            return callback(new Error("Update failed"));
        });
    };
    SkillDB.prototype.isExists = function (tag, callback) {
        if (!tag) {
            return callback(false);
        }
        var sql = "select * from " + this.tableName + " where tag = '" + tag + "'";
        this.db
            .load(sql)
            .then(function (data) {
            if (data) {
                return callback(true);
            }
            return callback(false);
        })
            .catch(function (err) {
            console.log("[SkillDB][isExists][err]", err);
            return callback(false);
        });
    };
    SkillDB.prototype.removeSkill = function (skillID, callback) {
        if (!skillID || skillID < 0) {
            return callback(new Error("undefined skill"));
        }
        this.db
            .delete(this.tableName, "id", skillID)
            .then(function (data) {
            var affectedRow = Number(data);
            if (affectedRow < 1) {
                return callback(null, false);
            }
            return callback(null, true);
        })
            .catch(function (err) {
            console.log("[SkillDB][removeSkill][err]", err);
            return callback(err);
        });
    };
    return SkillDB;
}());
exports.default = SkillDB;
