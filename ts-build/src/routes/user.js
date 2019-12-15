"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("../handler/user/user");
var passport_1 = __importDefault(require("passport"));
var authen_1 = __importDefault(require("../plugins/middlewares/authen"));
var upload_1 = __importDefault(require("../plugins/middlewares/upload"));
/**
 * / route
 *
 * @class User
 */
var UserRoute = /** @class */ (function () {
    function UserRoute() {
        this.handler = new user_1.UserHandler();
    }
    /**
     * Create the routes.
     *
     * @class UserRoute
     * @method create
     * @static
     */
    UserRoute.prototype.create = function (router) {
        var _this = this;
        router.post("/login", function (req, res, next) {
            _this.handler.login(req, res, next);
        });
        router.get("/auth/facebook", passport_1.default.authenticate("facebook", { scope: "email" }));
        router.get("/auth/facebook/callback", function (req, res, next) {
            _this.handler.loginViaFB(req, res);
        });
        router.get("/auth/google", passport_1.default.authenticate("google", { scope: "email" }));
        router.get("/auth/google/callback", function (req, res, next) {
            _this.handler.loginViaGG(req, res);
        });
        router.post("/register", function (req, res) {
            _this.handler.register(req, res);
        });
        router.get("/profile", function (req, res, next) {
            authen_1.default.forUser(req, res, next);
        }, function (req, res) {
            _this.handler.getProfile(req, res);
        });
        router.post("/updateprofile", function (req, res, next) {
            authen_1.default.forUser(req, res, next);
        }, function (req, res) {
            _this.handler.updateProfile(req, res);
        });
        router.post("/updatepassword", function (req, res, next) {
            authen_1.default.forUser(req, res, next);
        }, function (req, res) {
            _this.handler.updatePassword(req, res);
        });
        router.post("/forgotpassword", function (req, res) {
            _this.handler.forgotPassword(req, res);
        });
        router.post("/updateavatar", function (req, res, next) {
            authen_1.default.forUser(req, res, next);
        }, function (req, res, next) {
            upload_1.default(req, res, next);
        }, function (req, res) {
            // sleep to ensure filename is forwarded
            setTimeout(function () {
                _this.handler.updateAvatar(req, res);
            }, 500);
        });
        router.get("/activeaccount/:username", function (req, res) {
            _this.handler.activateAccount(req, res);
        });
        router.get("/confirmchange/:id", function (req, res) {
            _this.handler.confirmChange(req, res);
        });
        router.get("/reclaimpassword/:secret", function (req, res) {
            _this.handler.reclaimPassword(req, res);
        });
    };
    return UserRoute;
}());
exports.UserRoute = UserRoute;
