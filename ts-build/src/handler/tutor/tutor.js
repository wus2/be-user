"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tutor_1 = __importDefault(require("../../plugins/database/tutor/tutor"));
var skill_1 = __importDefault(require("../../plugins/database/skill/skill"));
var contract_1 = require("../../plugins/database/contract/contract");
var socket_1 = require("../../plugins/socket/socket");
var notification_1 = require("../../plugins/database/notification/notification");
var notification_2 = require("../../plugins/sse/notification");
var Pagination = 12;
var TutorHandler = /** @class */ (function () {
    function TutorHandler() {
        var _this = this;
        this.tutorDB = new tutor_1.default();
        this.skillDB = new skill_1.default();
        this.contractDB = new contract_1.ContractDB();
        this.notiDB = new notification_1.NotificationDB();
        this.memCache = new Map();
        socket_1.SocketServer.Instance()
            .then(function (socket) {
            _this.socket = socket;
            console.log("[TutorHandler]Socket get instance");
        })
            .catch(function (err) {
            console.log(err);
        });
    }
    TutorHandler.prototype.updateSkills = function (req, res) {
        var skills = req.body.skills;
        if (!skills) {
            return res.json({
                code: -1,
                message: "Field skills is incorrect"
            });
        }
        var payload = res.locals.payload;
        this.tutorDB.updateSkills(payload.id, skills, function (err, data) {
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
    TutorHandler.prototype.getListTutors = function (req, res) {
        var page = Number(req.params.page);
        var limit = Number(req.params.limit);
        if (page <= 0 || limit < 0) {
            return res.json({
                code: -1,
                message: "Page or limit is incorrect"
            });
        }
        var offset = (page - 1) * Pagination;
        this.tutorDB.getList(offset, limit, function (err, data) {
            if (err) {
                return res.json({
                    code: -1,
                    message: err.toString()
                });
            }
            data.forEach(function (tutor) {
                if (tutor.skill_tags) {
                    tutor.skill_tags = JSON.parse(tutor.skill_tags);
                }
            });
            return res.status(200).json({
                code: 1,
                message: "OK",
                data: data
            });
        });
    };
    TutorHandler.prototype.updateIntro = function (req, res) {
        var desc = req.body.introDesc;
        if (!desc) {
            return res.json({
                code: -1,
                message: "Empty description"
            });
        }
        var payload = res.locals.payload;
        this.tutorDB.updateIntro(payload.id, desc, function (err, data) {
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
    TutorHandler.prototype.getProfile = function (req, res) {
        var tutorID = Number(req.params.tutorID);
        if (!tutorID) {
            return res.json({
                code: -1,
                message: "Empty tutorID"
            });
        }
        this.tutorDB.getProfile(tutorID, function (err, data) {
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
    TutorHandler.prototype.getAllSkill = function (req, res) {
        this.skillDB.warmUp(Infinity, function (err, data) {
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
    TutorHandler.prototype.filterTutor = function (req, res) {
        var page = Number(req.query.page);
        var limit = Number(req.query.limit);
        if (page == NaN || limit == NaN || page <= 0 || limit < 0) {
            return res.json({
                code: -1,
                message: "Page or limit is incorrect"
            });
        }
        var offset = (page - 1) * Pagination;
        var district = req.query.district;
        var minPrice = req.query.minPrice;
        var maxPrice = req.query.maxPrice;
        var skill = req.query.skill;
        this.tutorDB.filterTutor(district, minPrice, maxPrice, skill, offset, limit, function (err, data) {
            if (err) {
                return res.json({
                    code: -1,
                    message: err.toString()
                });
            }
            data.forEach(function (tutor) {
                if (tutor.skill_tags) {
                    tutor.skill_tags = JSON.parse(tutor.skill_tags);
                }
            });
            return res.status(200).json({
                code: 1,
                message: "OK",
                data: data
            });
        });
    };
    TutorHandler.prototype.getListContracttHistory = function (req, res) {
        var payload = res.locals.payload;
        if (!payload) {
            return res.json({
                code: -1,
                message: "User payload is invalid"
            });
        }
        var page = Number(req.params.page);
        var limit = Number(req.params.limit);
        if (page == NaN || limit == NaN || page <= 0 || limit < 0) {
            return res.json({
                code: -1,
                message: "Page or limit is incorrect"
            });
        }
        var offset = (page - 1) * Pagination;
        this.contractDB.getListContractWithUserInfo(payload.id, payload.role, offset, limit, function (err, data) {
            if (err) {
                return res.json({
                    code: -1,
                    message: err.toString()
                });
            }
            data.forEach(function (element) {
                if (element.skill_tags) {
                    element.skill_tags = JSON.parse(element.skill_tags);
                }
                console.log(element.skill_tags);
            });
            return res.status(200).json({
                code: 1,
                message: "OK",
                data: data
            });
        });
    };
    TutorHandler.prototype.renevueStatics = function (req, res) { };
    TutorHandler.prototype.getDetailContract = function (req, res) {
        var contractID = Number(req.params.contractID);
        if (contractID < 0) {
            return res.json({
                code: -1,
                message: "Contract ID is incorrect"
            });
        }
        var payload = res.locals.payload;
        if (!payload) {
            return res.json({
                code: -1,
                message: "User payload is empty"
            });
        }
        this.contractDB.getContractViaRole(contractID, payload.role, function (err, data) {
            if (err) {
                return res.json({
                    code: -1,
                    message: err.toString()
                });
            }
            var payload = res.locals.payload;
            if (!payload) {
                return res.json({
                    code: -1,
                    message: "User payload is empty"
                });
            }
            var contract = data[0];
            if (contract.tutor_id != payload.id) {
                return res.json({
                    code: -1,
                    message: "Permission denied"
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
    TutorHandler.prototype.approveContract = function (req, res) {
        var _this = this;
        var contractID = Number(req.params.contractID);
        if (contractID < 0) {
            return res.json({
                code: -1,
                message: "Contract ID is incorrect"
            });
        }
        this.contractDB.getContract(contractID, function (err, data) {
            if (err) {
                return res.json({
                    code: -1,
                    message: err.toString()
                });
            }
            var contract = data[0];
            var payload = res.locals.payload;
            if (!payload) {
                return res.json({
                    code: -1,
                    message: "User payload is undefined"
                });
            }
            if (contract.tutor_id && payload.id != contract.tutor_id) {
                return res.json({
                    code: -1,
                    message: "This is not your contract"
                });
            }
            var now = ~~(new Date().getTime() / 1000);
            console.log("[TutorHandler][approveContract][now]", now);
            if (contract.create_time && now > contract.create_time + 864e5) {
                // 864e5 is 2 date in timestamp
                console.log("[TutorHandler][approveContract][expired time]", contract.create_time + 864e5);
                return res.json({
                    code: -1,
                    message: "Contract is expired"
                });
            }
            console.log("[TutorHandler][approveContract][contract]", contract);
            contract.status = contract_1.ContractStatus.Approved;
            _this.contractDB.updateContract(contract, function (err, data) {
                if (err) {
                    return res.json({
                        code: -1,
                        message: err.toString()
                    });
                }
                if (!contract.tutor_id) {
                    return res.json({
                        code: -1,
                        message: "Tutor of contract is empty"
                    });
                }
                _this.tutorDB.getProfile(contract.tutor_id, function (err, data) {
                    if (err) {
                        return res.json({
                            code: -1,
                            message: "Get Tutor profile failed"
                        });
                    }
                    var tutor = data[0];
                    if (!tutor) {
                        return res.json({
                            code: -1,
                            message: "Tutor model is not correct"
                        });
                    }
                    var entity = {
                        user_id: contract.tutee_id,
                        from_name: tutor.name,
                        contract_id: contract.cid,
                        description: notification_2.GetApproveContractDesc(tutor.name)
                    };
                    _this.notiDB.setNotification(entity, function (err, data) {
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
                });
            });
        });
    };
    TutorHandler.prototype.getRateResults = function (req, res) {
        var tutorID = Number(req.query.tutor_id);
        if (!tutorID || tutorID < 0) {
            return res.json({
                code: -1,
                message: "Tutor ID is incorrect"
            });
        }
        var page = Number(req.query.page);
        var limit = Number(req.query.limit);
        if (!page || !limit || page <= 0 || limit < 0) {
            return res.json({
                code: -1,
                message: "Page or limit is incorrect"
            });
        }
        var offset = (page - 1) * Pagination;
        this.contractDB.getRateResultInContract(tutorID, offset, limit, function (err, data) {
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
    TutorHandler.prototype.getTopTutor = function (req, res) {
        var page = Number(req.query.page);
        var limit = Number(req.query.limit);
        if (!page || !limit || page <= 0 || limit < 0) {
            return res.json({
                code: -1,
                message: "Page or limit is incorrect"
            });
        }
        var offset = (page - 1) * Pagination;
        this.tutorDB.getToptutor(offset, limit, function (err, data) {
            if (err) {
                return res.json({
                    code: -1,
                    message: err.toString()
                });
            }
            data.forEach(function (element) {
                if (element.skill_tags) {
                    element.skill_tags = JSON.parse(element.skill_tags);
                }
                console.log(element.skill_tags);
            });
            return res.status(200).json({
                code: 1,
                message: "OK",
                data: data
            });
        });
    };
    TutorHandler.prototype.revenue = function (req, res) {
        var tutorID = Number(req.query.tutor_id);
        if (!tutorID || tutorID < 0) {
            return res.json({
                code: -1,
                message: "Tutor ID is incorrect"
            });
        }
        var payload = res.locals.payload;
        if (!payload) {
            return res.json({
                code: -1,
                message: "User payload is empty"
            });
        }
        if (tutorID != payload.id) {
            return res.json({
                code: -1,
                message: "Permission denied"
            });
        }
        var start = Number(req.query.start_time);
        var end = Number(req.query.end_time);
        if (!start || !end || start < 0 || end < 0 || start > end) {
            return res.json({
                code: -1,
                message: "Start time or end time is incorrect"
            });
        }
        this.contractDB.reveneuForTutor(tutorID, start, end, function (err, data) {
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
    return TutorHandler;
}());
exports.TutorHandler = TutorHandler;
