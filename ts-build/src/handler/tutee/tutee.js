"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var contract_1 = require("../../plugins/database/contract/contract");
var tutor_1 = __importDefault(require("../../plugins/database/tutor/tutor"));
var sse_1 = require("../../plugins/sse/sse");
var notification_1 = require("../../plugins/sse/notification");
var user_1 = __importDefault(require("../../plugins/database/user/user"));
var TuteeHandler = /** @class */ (function () {
    function TuteeHandler() {
        this.contractDB = new contract_1.ContractDB();
        this.tutorDB = new tutor_1.default();
        this.userDB = new user_1.default();
    }
    TuteeHandler.prototype.rentTutor = function (req, res) {
        var _this = this;
        var payload = res.locals.payload;
        if (!payload) {
            return res.json({
                code: -1,
                message: "User payload is undefined"
            });
        }
        var startTime = ~~(Date.parse(req.body.startTime) / 1000);
        if (!startTime) {
            return res.json({
                code: -1,
                message: "Format start time is not correct"
            });
        }
        var tutorID = Number(req.body.tutorID);
        var tutorUsername = req.body.tutor;
        var rentTime = Number(req.body.rentTime);
        var rentPrice = Number(req.body.rentPrice);
        if (tutorID < 0 || rentTime < 0 || rentPrice < 0) {
            return res.json({
                code: -1,
                message: "Some fields is incorrect"
            });
        }
        var entity = {
            tutor_id: tutorID,
            tutee_id: payload.id,
            desc: req.body.description,
            start_time: startTime,
            rent_time: rentTime,
            rent_price: rentPrice,
            create_time: ~~(Date.now() / 1000),
            status: contract_1.ContractStatus.Pending
        };
        if (!entity) {
            return res.json({
                code: -1,
                message: "Some fields is not correct"
            });
        }
        this.contractDB.setContract(entity, function (err, data) {
            if (err) {
                return res.json({
                    code: -1,
                    message: err.toString()
                });
            }
            // notify to tutor
            // TODO: convert to async
            _this.userDB.getByID(payload.id, function (err, data) {
                if (err) {
                    console.log("[TuteeHandler][rentTutor][err]", err);
                    return;
                }
                var tutee = data[0];
                if (!tutee) {
                    console.log("[TuteeHandler][rentTutor][notify][err] Data is not user model");
                    return;
                }
                var contractID = data[0].id;
                if (!contractID) {
                    console.log("[TuteeHandler][rentTutor][notify[err] ContractID is not found");
                    return;
                }
                if (!tutee.name) {
                    console.log("[TuteeHandler][rentTutor][notify[err] Tutee name invalid");
                    return;
                }
                var notification = {
                    contractID: contractID,
                    topic: notification_1.ContractTopic,
                    description: notification_1.GetContractDescription(tutee.name)
                };
                sse_1.SSE.SendMessage(tutorUsername, notification);
            });
            return res.status(200).json({
                code: 1,
                meesage: "OK"
            });
        });
    };
    TuteeHandler.prototype.getListContractHistory = function (req, res) {
        var payload = res.locals.payload;
        if (!payload) {
            return res.json({
                code: -1,
                message: "User payload is invalid"
            });
        }
        var offset = Number(req.params.offset);
        var limit = Number(req.params.limit);
        if (offset < 0 || limit < 0) {
            return res.json({
                code: -1,
                message: "Offset or limit is incorrect"
            });
        }
        this.contractDB.getListContract(payload.id, payload.role, offset, limit, function (err, data) {
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
    TuteeHandler.prototype.getDetailContractHistory = function (req, res) {
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
            return res.status(200).json({
                code: 1,
                message: "OK",
                data: data[0]
            });
        });
    };
    TuteeHandler.prototype.evaluateRateForTutor = function (req, res) {
        var _this = this;
        var stars = Number(req.body.stars);
        if (stars < 0 || stars > 5) {
            return res.json({
                code: -1,
                message: "Stars is incorrect"
            });
        }
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
                    message: "Get contract is incorrect"
                });
            }
            var contract = data[0];
            console.log("[Tutee][evaluateContract][contract]", contract);
            if (!contract) {
                return res.json({
                    code: -1,
                    message: "Contract model in database is incorrect"
                });
            }
            if (!contract.tutor_id) {
                return res.json({
                    code: -1,
                    message: "Tutor ID is empty"
                });
            }
            var payload = res.locals.payload;
            if (!payload) {
                return res.json({
                    code: -1,
                    message: "User payload is invalid"
                });
            }
            if (contract.tutee_id != payload.id) {
                return res.json({
                    code: -1,
                    message: "Permission denied"
                });
            }
            if (contract.status != contract_1.ContractStatus.Finished) {
                return res.json({
                    code: -1,
                    message: "Contract is not finished"
                });
            }
            console.log("[Tutee][evaluateContract][stars]", contract.stars);
            if (contract.stars != null) {
                return res.json({
                    code: -1,
                    message: "Contract is evaluated"
                });
            }
            var entity = {
                id: contractID,
                stars: stars
            };
            _this.contractDB.updateContract(entity, function (err, data) {
                if (err) {
                    return res.json({
                        code: -1,
                        message: "Update stars to database failed"
                    });
                }
                if (contract.tutor_id) {
                    _this.tutorDB.updateRate(contract.tutor_id, stars, function (err, data) {
                        if (err) {
                            return res.json({
                                code: -1,
                                message: err.toString()
                            });
                        }
                        // notify to tutor
                        var handle = function () {
                            return new Promise(function (resolve) {
                                var notification = {
                                    contractID: contract.id,
                                    topic: notification_1.RateTopic,
                                    description: notification_1.GetRateDescription("")
                                };
                                sse_1.SSE.SendMessage("", entity);
                            });
                        };
                        var notify = function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var result;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            console.log("[TuteeHandler][evaluateRateForTutor] start notify");
                                            return [4 /*yield*/, handle()];
                                        case 1:
                                            result = _a.sent();
                                            console.log("[TuteeHandler][evaluateRateForTutor] finish notify");
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        };
                        notify();
                        return res.status(200).json({
                            code: 1,
                            message: "OK"
                        });
                    });
                }
            });
        });
    };
    TuteeHandler.prototype.evaluateCommentForTutor = function (req, res) {
        var _this = this;
        var comment = req.body.comment;
        if (!comment) {
            return res.json({
                code: -1,
                message: "Comment is empty"
            });
        }
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
                    message: "Get contract is incorrect"
                });
            }
            var contract = data[0];
            if (!contract) {
                return res.json({
                    code: -1,
                    message: "Contract model in database is incorrect"
                });
            }
            if (!contract.tutor_id) {
                return res.json({
                    code: -1,
                    message: "Tutor ID is empty"
                });
            }
            var payload = res.locals.payload;
            if (!payload) {
                return res.json({
                    code: -1,
                    message: "User payload is invalid"
                });
            }
            if (contract.tutee_id != payload.id) {
                return res.json({
                    code: -1,
                    message: "Permission denied"
                });
            }
            if (contract.status != contract_1.ContractStatus.Finished) {
                return res.json({
                    code: -1,
                    message: "Contract is not finished"
                });
            }
            console.log("[Tutee][evaluateCommentContract][data]", contract.comment);
            if (contract.comment != null) {
                return res.json({
                    code: -1,
                    message: "Contract is evaluated"
                });
            }
            var entity = {
                id: contractID,
                comment: comment
            };
            _this.contractDB.updateContract(entity, function (err, data) {
                if (err) {
                    return res.json({
                        code: -1,
                        message: "Update stars to database failed"
                    });
                }
                // TODO: notify to tutor
                return res.status(200).json({
                    code: 1,
                    message: "OK"
                });
            });
        });
    };
    TuteeHandler.prototype.payContract = function (req, res) {
        var _this = this;
        var contractID = Number(req.params.contractID);
        if (contractID < 0) {
            return res.json({
                code: -1,
                message: "ContractID is invalid"
            });
        }
        this.contractDB.getContract(contractID, function (err, data) {
            if (err) {
                return res.json({
                    code: -1,
                    message: "Get contract failed"
                });
            }
            var contract = data[0];
            if (!contract) {
                return res.json({
                    code: -1,
                    message: "Contract model is incorrect"
                });
            }
            var payload = res.locals.payload;
            if (!payload) {
                return res.json({
                    code: -1,
                    message: "User payload is incorrect"
                });
            }
            if (contract.tutee_id != payload.id) {
                return res.json({
                    code: 1,
                    message: "Permission denied"
                });
            }
            if (contract.status != contract_1.ContractStatus.Approved) {
                return res.json({
                    code: -1,
                    message: "Contract is not approved"
                });
            }
            // check amount and pay if ok
            var entity = {
                id: contract.id,
                status: contract_1.ContractStatus.Paid
            };
            _this.contractDB.updateContract(entity, function (err, data) {
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
    };
    TuteeHandler.prototype.complainContract = function (req, res) {
        this.evaluateCommentForTutor(req, res);
    };
    return TuteeHandler;
}());
exports.TuteeHandler = TuteeHandler;
