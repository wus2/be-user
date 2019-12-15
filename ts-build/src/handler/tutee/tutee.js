"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tutor_1 = __importDefault(require("../../plugins/database/tutor/tutor"));
var TutorHandler = /** @class */ (function () {
    function TutorHandler() {
        this.tutorDB = new tutor_1.default();
    }
    TutorHandler.prototype.enrollClass = function (req, res) { };
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
