"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var authen_1 = __importDefault(require("../plugins/middlewares/authen"));
var message_1 = require("../plugins/database/message/message");
/**
 * / route
 *
 * @class User
 */
var MessageRoute = /** @class */ (function () {
    function MessageRoute() {
    }
    /**
     * Create the routes.
     *
     * @class UserRoute
     * @method create
     * @static
     */
    MessageRoute.prototype.create = function (router) {
        router.post("/mess", function (req, res, next) {
            authen_1.default.forUser(req, res, next);
        }, function (req, res) {
            var page = Number(req.query.page);
            var limit = Number(req.query.limit);
            if (!page || !limit || page <= 0 || limit < 0) {
                return res.json({
                    code: -1,
                    message: "Page or limit is incorrect"
                });
            }
            var tutor = req.query.tutor;
            var tutee = req.query.tutee;
            if (!tutor || tutee) {
                return res.json({
                    code: -1,
                    message: "Tutor or tutee is incorrect"
                });
            }
            var room = tutee + ":" + tutor;
            var offset = (page - 1) * 12;
            new message_1.MessageDB().getMessageHistory(room, offset, limit, function (err, data) {
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
    };
    return MessageRoute;
}());
exports.MessageRoute = MessageRoute;
