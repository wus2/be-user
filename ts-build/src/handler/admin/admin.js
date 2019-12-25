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
var user_1 = __importStar(require("../../plugins/database/user/user"));
var skill_1 = __importDefault(require("../../plugins/database/skill/skill"));
var complain_1 = require("../../plugins/database/complain/complain");
var contract_1 = require("../../plugins/database/contract/contract");
var Pagination = 12;
var AdminHandler = /** @class */ (function () {
    function AdminHandler() {
        this.userDB = new user_1.default();
        this.skillDB = new skill_1.default();
        this.complainDB = new complain_1.ComplainDB();
        this.contractDB = new contract_1.ContractDB();
    }
    AdminHandler.prototype.getListUser = function (req, res) {
        var page = Number(req.params.page);
        var limit = Number(req.params.limit);
        if (page <= 0 || limit < 0) {
            return res.json({
                code: -1,
                message: "Page or limit is incorrect"
            });
        }
        var offset = (page - 1) * Pagination;
        this.userDB.getListUsers(offset, limit, function (err, data) {
            if (err) {
                return res.json({
                    code: -1,
                    message: err.toString()
                });
            }
            return res.status(200).json({
                code: 1,
                message: "OK",
                data: data
            });
        });
    };
    AdminHandler.prototype.getUserProfile = function (req, res) {
        var userID = Number(req.params.userID);
        if (!userID || userID < 0) {
            return res.json({
                code: -1,
                message: "UserID is incorrect"
            });
        }
        this.userDB.getByID(userID, function (err, data) {
            if (err) {
                return res.json({
                    code: -1,
                    message: err.toString()
                });
            }
            if (data[0].skill_tags) {
                data[0].skill_tags = JSON.parse(data[0].skill_tags);
            }
            return res.status(200).json({
                code: 1,
                message: "OK",
                data: data[0]
            });
        });
    };
    AdminHandler.prototype.getListSkill = function (req, res) {
        var page = Number(req.params.page);
        var limit = Number(req.params.limit);
        if (page <= 0 || limit < 0) {
            return res.json({
                code: -1,
                message: "Page or limit is incorrect"
            });
        }
        var offset = (page - 1) * Pagination;
        this.skillDB.getSkills(offset, limit, function (err, data) {
            if (err) {
                return res.json({
                    code: -1,
                    message: err.toString()
                });
            }
            return res.status(200).json({
                code: 1,
                message: "OK",
                data: data
            });
        });
    };
    AdminHandler.prototype.getSkill = function (req, res) {
        var skillID = Number(req.params.skillID);
        if (!skillID || skillID < 0) {
            return res.json({
                code: -1,
                message: "Skill ID is incorrect"
            });
        }
        this.skillDB.getSkill(skillID, function (err, data) {
            if (err) {
                return res.json({
                    code: -1,
                    message: err.toString().toString()
                });
            }
            return res.status(200).json({
                code: 1,
                message: "OK",
                data: data[0]
            });
        });
    };
    AdminHandler.prototype.addSkill = function (req, res) {
        var skillStr = req.body.skill;
        if (!skillStr) {
            return res.json({
                code: -1,
                message: "Skill is empty!"
            });
        }
        var entity = {
            tag: skillStr
        };
        this.skillDB.addSkill(entity, function (err, data) {
            if (err) {
                return res.json({
                    code: -1,
                    message: err.toString()
                });
            }
            return res.status(200).json({
                code: 1,
                message: "OK"
            });
        });
    };
    AdminHandler.prototype.updateSkill = function (req, res) {
        var skillID = Number(req.body.skillID);
        if (!skillID || skillID < 0) {
            return res.json({
                code: -1,
                message: "Skill ID is incorrect"
            });
        }
        var entity = {
            id: skillID,
            tag: req.body.skill,
            desc: req.body.desc
        };
        if (!entity) {
            return res.json({
                code: -1,
                message: "Skill ID or skill name is empty"
            });
        }
        this.skillDB.updateSkill(skillID, entity, function (err, data) {
            if (err) {
                return res.json({
                    code: -1,
                    message: err.toString()
                });
            }
            return res.status(200).json({
                code: 1,
                message: "OK"
            });
        });
    };
    AdminHandler.prototype.removeSkill = function (req, res) {
        var skillID = Number(req.params.skillID);
        if (!skillID || skillID < 0) {
            return res.json({
                code: -1,
                message: "Empty skill ID"
            });
        }
        this.skillDB.removeSkill(skillID, function (err, ok) {
            if (err || !ok) {
                return res.json({
                    code: -1,
                    message: "Remove failed"
                });
            }
            return res.status(200).json({
                code: 1,
                message: "OK"
            });
        });
    };
    AdminHandler.prototype.lockUser = function (req, res) {
        var userID = Number(req.params.userID);
        if (userID < 0) {
            return res.json({
                cpde: -1,
                message: "User ID is incorrect"
            });
        }
        var entity = {
            id: userID,
            account_status: user_1.AccountStatus.Block
        };
        this.userDB.updateUser(entity, function (err, data) {
            if (err) {
                return res.json({
                    code: -1,
                    message: err.toString()
                });
            }
            return res.status(200).json({
                code: 1,
                message: "OK"
            });
        });
    };
    AdminHandler.prototype.unlockUser = function (req, res) {
        var userID = Number(req.params.userID);
        if (userID < 0) {
            return res.json({
                cpde: -1,
                message: "User ID is incorrect"
            });
        }
        var entity = {
            id: userID,
            account_status: user_1.AccountStatus.Active
        };
        this.userDB.updateUser(entity, function (err, data) {
            if (err) {
                return res.json({
                    code: -1,
                    message: err.toString()
                });
            }
            return res.status(200).json({
                code: 1,
                message: "OK"
            });
        });
    };
    AdminHandler.prototype.processComplain = function (req, res) { };
    AdminHandler.prototype.getUserMessageHistory = function (req, res) { };
    AdminHandler.prototype.getListComplain = function (req, res) {
        var page = Number(req.params.page);
        var limit = Number(req.params.limit);
        if (page == NaN || limit == NaN || page <= 0 || limit < 0) {
            return res.json({
                code: -1,
                message: "Page or limit is incorrect"
            });
        }
        var offset = (page - 1) * Pagination;
        this.complainDB.getListComplain(offset, limit, function (err, data) {
            if (err) {
                return res.json({
                    code: -1,
                    message: err.toString()
                });
            }
            return res.status(200).json({
                code: -1,
                message: "OK",
                data: data
            });
        });
    };
    AdminHandler.prototype.getListContract = function (req, res) {
        var page = Number(req.params.page);
        var limit = Number(req.params.limit);
        if (page == NaN || limit == NaN || page <= 0 || limit < 0) {
            return res.json({
                code: -1,
                message: "Page or limit is incorrect"
            });
        }
        var offset = (page - 1) * Pagination;
        this.contractDB.getListUserContract(offset, limit, function (err, data) {
            if (err) {
                return res.json({
                    code: -1,
                    message: err.toString()
                });
            }
            return res.status(200).json({
                code: 1,
                message: "OK",
                data: data
            });
        });
    };
    AdminHandler.prototype.updateContract = function (req, res) {
        var contractID = Number(req.body.contractID);
        if (!contractID || contractID < 0) {
            return res.json({
                code: -1,
                message: "Contract ID is incorrect"
            });
        }
        var entity = {
            cid: contractID,
            start_time: req.body.start_time,
            status: req.body.status,
            comment: req.body.comment
        };
        if (!entity) {
            return res.json({
                code: -1,
                message: "Contract model is incorrect"
            });
        }
        this.contractDB.updateContract(entity, function (err, data) {
            if (err) {
                return res.json({
                    code: -1,
                    message: err.toString()
                });
            }
            return res.status(200).json({
                code: 1,
                message: "OK"
            });
        });
    };
    return AdminHandler;
}());
exports.AdminHandler = AdminHandler;
