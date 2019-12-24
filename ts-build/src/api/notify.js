"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var authen_1 = __importDefault(require("../plugins/middlewares/authen"));
var notification_1 = require("../plugins/database/notification/notification");
var Pagination = 12;
var NotifyRoute = /** @class */ (function () {
    function NotifyRoute() {
    }
    NotifyRoute.prototype.create = function (router) {
        router.get("/:notiID", function (req, res, next) {
            authen_1.default.forUser(req, res, next);
        }, function (req, res) {
            var notiID = Number(req.params.notiID);
            if (notiID < 0) {
                return res.json({
                    code: -1,
                    message: "Notification ID is incorrect"
                });
            }
            new notification_1.NotificationDB().getNotification(notiID, function (err, data) {
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
        });
        router.get("/list/page/:page/limit/:limit", function (req, res, next) {
            authen_1.default.forUser(req, res, next);
        }, function (req, res) {
            var payload = res.locals.payload;
            if (!payload) {
                return res.json({
                    code: -1,
                    message: "User payload is empty"
                });
            }
            var page = Number(req.params.page);
            var limit = Number(req.params.limit);
            if (page <= 0 || limit <= 0) {
                res.json({
                    code: -1,
                    message: "Page or limit is incorrect"
                });
            }
            var offset = (page - 1) * Pagination;
            new notification_1.NotificationDB().getListNotification(payload.id, offset, limit, function (err, data) {
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
        });
        router.post("/add", function (req, res, next) {
            authen_1.default.forUser(req, res, next);
        }, function (req, res) {
            var userID = Number(req.body.userID);
            if (userID < 0) {
                return res.json({
                    code: -1,
                    message: "User ID is empty"
                });
            }
            var desc = req.body.description;
            if (!desc) {
                return res.json({
                    code: -1,
                    message: "Description is empty"
                });
            }
            var entity = {
                user_id: userID,
                description: desc,
                create_time: ~~(Date.now() / 1000),
                status: notification_1.NotificationStatus.NotSeen
            };
            new notification_1.NotificationDB().setNotification(entity, function (err, data) {
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
        router.post("/seen/:notiID", function (req, res, next) {
            authen_1.default.forUser(req, res, next);
        }, function (req, res) {
            var notiID = Number(req.params.notiID);
            if (notiID < 0) {
                return res.json({
                    code: -1,
                    message: "Notification ID is incorrect"
                });
            }
            new notification_1.NotificationDB().setSeen(notiID, function (err, data) {
                if (err) {
                    return res.json({
                        code: -1,
                        message: err.toString()
                    });
                }
                return res.status(200).json({
                    code: -1,
                    message: "OK"
                });
            });
        });
    };
    return NotifyRoute;
}());
exports.NotifyRoute = NotifyRoute;
