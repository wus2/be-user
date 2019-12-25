"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var authen_1 = __importDefault(require("../plugins/middlewares/authen"));
var admin_1 = require("../handler/admin/admin");
/**
 * / route
 *
 * @class User
 */
var AdminRoute = /** @class */ (function () {
    function AdminRoute() {
        this.handler = new admin_1.AdminHandler();
    }
    /**
     * Create the routes.
     *
     * @class UserRoute
     * @method create
     * @static
     */
    AdminRoute.prototype.create = function (router) {
        var _this = this;
        router.get("/skills/page/:page/limit/:limit", function (req, res, next) {
            authen_1.default.forAdmin(req, res, next);
        }, function (req, res) {
            _this.handler.getListSkill(req, res);
        });
        router.get("/getskill/:skillID", function (req, res, next) {
            authen_1.default.forAdmin(req, res, next);
        }, function (req, res) {
            _this.handler.getSkill(req, res);
        });
        router.post("/addskill", function (req, res, next) {
            authen_1.default.forAdmin(req, res, next);
        }, function (req, res) {
            _this.handler.addSkill(req, res);
        });
        router.put("/updateskill", function (req, res, next) {
            authen_1.default.forAdmin(req, res, next);
        }, function (req, res) {
            _this.handler.updateSkill(req, res);
        });
        router.delete("/removeskill/:skillID", function (req, res, next) {
            authen_1.default.forAdmin(req, res, next);
        }, function (req, res) {
            _this.handler.removeSkill(req, res);
        });
        router.get("/getusers/page/:page/limit/:limit", function (req, res, next) {
            authen_1.default.forAdmin(req, res, next);
        }, function (req, res) {
            _this.handler.getListUser(req, res);
        });
        router.get("/user/:userID", function (req, res, next) {
            authen_1.default.forAdmin(req, res, next);
        }, function (req, res) {
            _this.handler.getUserProfile(req, res);
        });
        router.put("/blockuser/:userID", function (req, res, next) {
            authen_1.default.forAdmin(req, res, next);
        }, function (req, res) {
            _this.handler.lockUser(req, res);
        });
        router.put("/unblockuser/:userID", function (req, res, next) {
            authen_1.default.forAdmin(req, res, next);
        }, function (req, res) {
            _this.handler.unlockUser(req, res);
        });
        router.put("/processcomplain/:complainID", function (req, res, next) {
            authen_1.default.forAdmin(req, res, next);
        }, function (req, res) {
            _this.handler.processComplain(req, res);
        });
        router.get("/messagehistory", function (req, res, next) {
            authen_1.default.forAdmin(req, res, next);
        }, function (req, res) {
            _this.handler.getUserMessageHistory(req, res);
        });
        router.get("/listcomplain/page/:page/limit/:limit", function (req, res, next) {
            authen_1.default.forAdmin(req, res, next);
        }, function (req, res) {
            _this.handler.getListComplain(req, res);
        });
        router.get("/listcontract/page/:page/limit/:limit", function (req, res, next) {
            authen_1.default.forAdmin(req, res, next);
        }, function (req, res) {
            _this.handler.getListContract(req, res);
        });
    };
    return AdminRoute;
}());
exports.AdminRoute = AdminRoute;
