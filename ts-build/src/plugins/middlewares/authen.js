"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var Role_User = 0;
var Role_Tutor = 1;
var Role_Tutee = 2;
var Role_Admin = 2110;
var Authenticate = /** @class */ (function () {
    function Authenticate() {
    }
    Authenticate.forUser = function (req, res, next) {
        passport_1.default.authenticate("jwt", { session: false }, function (payload) {
            if (!payload) {
                return res.json({
                    code: -1,
                    message: "Unauthenticated!"
                });
            }
            res.locals.payload = payload;
            next();
        })(req, res, next);
    };
    Authenticate.forTutor = function (req, res, next) {
        passport_1.default.authenticate("jwt", { session: false }, function (payload) {
            if (!payload || payload.role != Role_Tutor) {
                return res.json({
                    code: -1,
                    message: "Unauthenticated!"
                });
            }
            res.locals.payload = payload;
            next();
        })(req, res, next);
    };
    Authenticate.forTutee = function (req, res, next) {
        passport_1.default.authenticate("jwt", { session: false }, function (payload) {
            if (!payload || payload.role != Role_Tutee) {
                return res.json({
                    code: -1,
                    message: "Unauthenticated!"
                });
            }
            res.locals.payload = payload;
            next();
        })(req, res, next);
    };
    Authenticate.forAdmin = function (req, res, next) {
        passport_1.default.authenticate("jwt", { session: false }, function (payload) {
            if (!payload || payload.role != Role_Admin) {
                return res.json({
                    code: -1,
                    message: "Unauthenticated!"
                });
            }
            res.locals.payload = payload;
            next();
        })(req, res, next);
    };
    return Authenticate;
}());
exports.default = Authenticate;
