"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var payment_1 = require("../handler/payment/payment");
var dateFormat = require("dateformat");
var PaymentRoute = /** @class */ (function () {
    function PaymentRoute() {
        this.handler = new payment_1.PaymentHandler();
    }
    PaymentRoute.prototype.create = function (router) {
        var _this = this;
        router.get("/", function (req, res) {
            res.render("orderlist", { title: "Danh sách hợp đồng" });
        });
        router.get("/create/:contractID", function (req, res) {
            _this.handler.GetOrder(req, res);
        });
        router.post("/create/:contractID", function (req, res) {
            _this.handler.CreateOrder(req, res);
        });
        router.get("/callback", function (req, res) {
            _this.handler.OrderCallback(req, res);
        });
        router.get("/ipn", function (req, res) {
            _this.handler.InstantPaymentNotification(req, res);
        });
    };
    return PaymentRoute;
}());
exports.PaymentRoute = PaymentRoute;
