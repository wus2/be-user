"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var dateFormat = require("dateformat");
var config = require("config");
var dateFormat = require("dateformat");
var querystring = require("qs");
var sha256 = require("sha256");
var Payment = /** @class */ (function () {
    function Payment() {
    }
    Payment.prototype.CreateOrder = function (order) {
        if (!order) {
            console.log("[Payment][CreateOrder][err] order is empty");
            return {
                code: -1,
                message: "Order is empty"
            };
        }
        order.vnp_Command = "pay";
        order.vnp_CurrCode = "VND";
        order.vnp_Version = "2";
        var tmnCode = config.get("vnp_TmnCode");
        var secretKey = config.get("vnp_HashSecret");
        var vnpUrl = config.get("vnp_Url");
        var returnUrl = config.get("vnp_ReturnUrl");
        order.vnp_ReturnUrl = returnUrl;
        order.vnp_TmnCode = tmnCode;
        order = utils_1.sortOrder(order);
        var signData = secretKey + querystring.stringify(order, { encode: false });
        var secureHash = sha256(signData);
        order.vnp_SecureHashType = "SHA256";
        order.vnp_SecureHash = secureHash;
        vnpUrl += "?" + querystring.stringify(order, { encode: true });
        return {
            code: 1,
            message: "OK",
            url: vnpUrl
        };
    };
    Payment.prototype.OrderCallback = function (vnp_Params) {
        var secureHash = vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];
        vnp_Params = utils_1.sortParams(vnp_Params);
        var tmnCode = config.get("vnp_TmnCode");
        var secretKey = config.get("vnp_HashSecret");
        var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });
        var checkSum = sha256(signData);
        if (secureHash !== checkSum) {
            return {
                code: -1,
                message: "Failed"
            };
        }
        return {
            code: 1,
            message: "Success"
        };
    };
    Payment.prototype.InstantPaymentNotification = function (vnp_Params) {
        var secureHash = vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];
        vnp_Params = utils_1.sortParams(vnp_Params);
        var secretKey = config.get("vnp_HashSecret");
        var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });
        var checkSum = sha256(signData);
        if (secureHash !== checkSum) {
            var orderId = vnp_Params["vnp_TxnRef"];
            var rspCode = vnp_Params["vnp_ResponseCode"];
            return {
                code: -1,
                message: "Failed"
            };
        }
        return {
            code: 1,
            message: "Success"
        };
    };
    return Payment;
}());
exports.default = Payment;
