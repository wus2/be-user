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
        router.get("/create", 
        // (req, res, next) => {
        //   Authenticate.forUser(req, res, next);
        // },
        function (req, res) {
            var date = new Date();
            var desc = "Thanh toan don hang thoi gian: " +
                dateFormat(date, "yyyy-mm-dd HH:mm:ss");
            res.render("order", {
                title: "Tạo mới đơn hàng",
                amount: 10000,
                description: desc
            });
        });
        router.post("/create/:contractID", 
        // (req, res, next) => {
        //   Authenticate.forUser(req, res, next);
        // },
        function (req, res) {
            _this.handler.CreateOrder(req, res);
        });
        router.get("/callback/", 
        // (req, res, next) => {
        //   Authenticate.forUser(req, res, next);
        // },
        function (req, res) {
            _this.handler.OrderCallback(req, res);
        });
        router.get("/ipn", 
        // (req, res, next) => {
        //   Authenticate.forUser(req, res, next);
        // },
        function (req, res) {
            _this.handler.InstantPaymentNotification(req, res);
        });
    };
    return PaymentRoute;
}());
exports.PaymentRoute = PaymentRoute;
