"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("../mysql"));
var skill_1 = __importDefault(require("../skill/skill"));
var Role_Tutor = 1;
var TutorDB = /** @class */ (function () {
    function TutorDB() {
        this.db = mysql_1.default;
        this.userDB = new skill_1.default();
        this.tableName = "user";
    }
    TutorDB.prototype.getList = function (offset, limit, callback) {
        if (offset < 0 || limit < 0) {
            callback(new Error("Offset or limit is incorrect"));
        }
        var sql = "select * from " + this.tableName + " where role = 1 limit " + offset + ", " + limit;
        this.db
            .load(sql)
            .then(function (data) {
            callback(null, data);
        })
            .catch(function (err) {
            console.log("[Tutor][getList][err]", err);
            callback(new Error("Get database failed"));
        });
    };
    TutorDB.prototype.updateIntro = function (tutorID, desc, callback) {
        if (tutorID < 0 || !desc) {
            callback(new Error("Empty desciption or Tutor ID is incorrect"));
        }
        var entity = {
            id: tutorID,
            intro_desc: desc
        };
        this.db
            .update(this.tableName, "id", entity)
            .then(function (data) {
            if (data) {
                return callback(null, data);
            }
            return callback(new Error("Update database failed"));
        })
            .catch(function (err) {
            console.log("[TutorDB][updateIntro][err]", err);
            callback(new Error("Update database failed"));
        });
    };
    TutorDB.prototype.getProfile = function (tutorID, callback) {
        if (tutorID < 0) {
            return callback(new Error("Empty tutorID"));
        }
        var sql = "select * from " + this.tableName + " where id = " + tutorID;
        this.db
            .load(sql)
            .then(function (data) {
            if (!data || data[0].role != Role_Tutor) {
                return callback(new Error("This user is not a tutor"));
            }
            return callback(null, data);
        })
            .catch(function (err) {
            console.log("[TutorDB][getProfile][err]", err);
            return callback(new Error("Get failed"));
        });
    };
    TutorDB.prototype.updateSkills = function (tutorID, skills, callback) {
        var _this = this;
        skills.forEach(function (skill) {
            _this.userDB.isExists(skill, function (ok) {
                if (!ok) {
                    console.log("[TutorDB][updateSkills][err] skill is not exists", skill);
                    return callback(new Error("Skill is incorrect"));
                }
            });
        });
        var skillStr = JSON.stringify(skills);
        var entity = {
            id: tutorID,
            skill_tags: skillStr
        };
        this.db
            .update(this.tableName, "id", entity)
            .then(function (data) {
            if (data) {
                return callback(null, data);
            }
            return callback(new Error("Update skill failed"));
        })
            .catch(function (err) {
            console.log("[TutorDB][updateSkill][err]", err);
            return callback(new Error("Update skill failed"));
        });
    };
    TutorDB.prototype.filterTutor = function (district, minPrice, maxPrice, skill, offset, limit, callback) {
        if (offset < 0 || limit < 0) {
            return callback(new Error("Offset or limit are incorrect"));
        }
        var sql = "select * from " + this.tableName + " where role = 1";
        if (district) {
            sql += " and district = '" + district + "'";
        }
        if (minPrice && maxPrice && minPrice <= maxPrice) {
            sql += " and price_per_hour >= " + minPrice + " and price_per_hour <= " + maxPrice;
        }
        if (skill) {
            sql += " and skill_tags like '" + skill + "'";
        }
        sql += " limit " + offset + ", " + limit;
        this.db
            .load(sql)
            .then(function (data) {
            if (data) {
                return callback(null, data);
            }
            return callback(new Error("Filter failed"));
        })
            .catch(function (err) {
            console.log("[TutorDB][filterTutor][err]", err);
            return callback(new Error("Filter failed"));
        });
    };
    TutorDB.prototype.getHistory = function () { };
    TutorDB.prototype.updateRate = function (tutorID, stars, callback) {
        var _this = this;
        if (tutorID < 0 || stars < 0) {
            return callback(new Error("TutorID or stars is incorrect"));
        }
        var sql = "select num_stars, num_rate from " + this.tableName + " where id = " + tutorID;
        this.db
            .load(sql)
            .then(function (data) {
            if (!data) {
                return callback(new Error("Get rate failed"));
            }
            var user = data[0];
            console.log("[TutorDB][updateRate][user]", user);
            if (!user.num_stars || user.num_rate == undefined) {
                user.num_stars = 0;
                user.num_rate = 0;
            }
            user.id = tutorID;
            user.num_stars += stars;
            user.num_rate++;
            console.log(user);
            _this.db
                .update(_this.tableName, "id", user)
                .then(function (data) {
                console.log("====", data);
                if (!data) {
                    return callback(new Error("Update rate to database failed"));
                }
                return callback();
            })
                .catch(function (err) {
                console.log("[TutorDB][updateRate][err]", err);
                return callback(new Error("Update rate to database failed"));
            });
        })
            .catch(function (err) {
            console.log("[TutorDB][updateRate][err]", err);
            return callback(new Error("Get rate from database failed"));
        });
    };
    return TutorDB;
}());
exports.default = TutorDB;
