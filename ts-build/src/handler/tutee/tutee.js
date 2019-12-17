"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var contract_1 = require("../../plugins/database/contract/contract");
var tutor_1 = __importDefault(require("../../plugins/database/tutor/tutor"));
var TuteeHandler = /** @class */ (function () {
    function TuteeHandler() {
        this.contractDB = new contract_1.ContractDB();
        this.tutorDB = new tutor_1.default();
    }
    TuteeHandler.prototype.rentTutor = function (req, res) {
        var payload = res.locals.payload;
        if (!payload) {
            return res.json({
                code: -1,
                message: "User payload is undefined"
            });
        }
        var startTime = Date.parse(req.body.startTime);
        if (!startTime) {
            return res.json({
                code: -1,
                message: "Format start time is not correct"
            });
        }
        var tutorID = Number(req.body.tutorID);
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
            start_time: startTime / 1000,
            rent_time: rentTime,
            rent_price: rentPrice,
            create_time: Date.now(),
            contract_status: contract_1.ContractStatus.Pending
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
            // TODO: notify to tutor
            // TODO: send to worker check expired
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
            console.log("[Tutee][evaluateContract][data]", contract.stars);
            if (!contract.stars || contract.stars != null) {
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
                        // TODO: notify to tutor
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
            if (!contract.comment) {
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
    TuteeHandler.prototype.chat = function (req, res) { };
    return TuteeHandler;
}());
exports.TuteeHandler = TuteeHandler;
