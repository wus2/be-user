"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var authen_1 = __importDefault(require("../plugins/middlewares/authen"));
var tutor_1 = require("../handler/tutor/tutor");
/**
 * / route
 *
 * @class User
 */
var TutorRoute = /** @class */ (function () {
    function TutorRoute() {
        this.handler = new tutor_1.TutorHandler();
    }
    /**
     * Create the routes.
     *
     * @class UserRoute
     * @method create
     * @static
     */
    TutorRoute.prototype.create = function (router) {
        var _this = this;
        router.put("/updateskills", function (req, res, next) {
            authen_1.default.forTutor(req, res, next);
        }, function (req, res) {
            _this.handler.updateSkills(req, res);
        });
        router.get("/getlist/page/:page/limit/:limit", function (req, res) {
            _this.handler.getListTutors(req, res);
        });
        router.put("/updateintro", function (req, res, next) {
            authen_1.default.forTutor(req, res, next);
        }, function (req, res) {
            _this.handler.updateIntro(req, res);
        });
        router.get("/getprofile/:tutorID", function (req, res) {
            _this.handler.getProfile(req, res);
        });
        router.get("/getallskills", function (req, res, next) {
            authen_1.default.forTutor(req, res, next);
        }, function (req, res) {
            _this.handler.getAllSkill(req, res);
        });
        router.get("/filtertutor", function (req, res) {
            _this.handler.filterTutor(req, res);
        });
        router.get("/contract/:contractID", function (req, res, next) {
            authen_1.default.forTutor(req, res, next);
        }, function (req, res) {
            _this.handler.getDetailContract(req, res);
        });
        router.get("/contracthistory/page/:page/limit/:limit", function (req, res, next) {
            authen_1.default.forTutor(req, res, next);
        }, function (req, res) {
            _this.handler.getListContracttHistory(req, res);
        });
        router.post("/approvecontract/:contractID", function (req, res, next) {
            authen_1.default.forTutor(req, res, next);
        }, function (req, res) {
            _this.handler.approveContract(req, res);
        });
        router.get("/rateresults", function (req, res) {
            _this.handler.getRateResults(req, res);
        });
        router.get("/top", function (req, res) {
            _this.handler.getTopTutor(req, res);
        });
        router.get("/revenue", function (req, res, next) {
            authen_1.default.forTutor(req, res, next);
        }, function (req, res) {
            _this.handler.revenue(req, res);
        });
    };
    return TutorRoute;
}());
exports.TutorRoute = TutorRoute;
