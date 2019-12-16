"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var contract_1 = require("../../plugins/database/contract/contract");
var TutorHandler = /** @class */ (function () {
    function TutorHandler() {
        this.contractDB = new contract_1.ContractDB();
    }
    TutorHandler.prototype.rentTutor = function (req, res) {
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
            contract_status: contract_1.Status.Pending
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
    TutorHandler.prototype.getListHistory = function (req, res) { };
    TutorHandler.prototype.getDetailHistory = function (req, res) { };
    TutorHandler.prototype.evaluateRateForTutor = function (req, res) { };
    TutorHandler.prototype.evaluateCommentForTutor = function (req, res) { };
    TutorHandler.prototype.payContract = function (req, res) { };
    TutorHandler.prototype.complainContract = function (req, res) { };
    TutorHandler.prototype.chat = function (req, res) { };
    return TutorHandler;
}());
exports.TutorHandler = TutorHandler;
