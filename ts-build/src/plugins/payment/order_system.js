"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_js_1 = __importDefault(require("crypto-js"));
var config_1 = __importDefault(require("config"));
var OrderSystem = /** @class */ (function () {
    function OrderSystem() {
    }
    OrderSystem.prototype.Compute = function (data) {
        return crypto_js_1.default.HmacSHA256(data, config_1.default.get("zalopay.key1")).toString();
    };
    OrderSystem.prototype._createOrderMacData = function (order) {
        return (order.appid +
            "|" +
            order.apptransid +
            "|" +
            order.appuser +
            "|" +
            order.amount +
            "|" +
            order.apptime +
            "|" +
            order.embeddata +
            "|" +
            order.item);
    };
    OrderSystem.prototype.CreateOrder = function (order) {
        return this.Compute(this._createOrderMacData(order));
    };
    OrderSystem.prototype.QuickPay = function (order, paymentcodeRaw) {
        return this.Compute(this._createOrderMacData(order) + "|" + paymentcodeRaw);
    };
    OrderSystem.prototype.Refund = function (appid, zptransid, amount, description, timestamp) {
        return this.Compute(appid +
            "|" +
            zptransid +
            "|" +
            amount +
            "|" +
            description +
            "|" +
            timestamp);
    };
    OrderSystem.prototype.GetOrderStatus = function (appid, apptransid) {
        return this.Compute(appid + "|" + apptransid + "|" + config_1.default.get("zalopay.key1"));
    };
    OrderSystem.prototype.GetRefundStatus = function (appid, mrefundid, timestamp) {
        return this.Compute(appid + "|" + mrefundid + "|" + timestamp);
    };
    OrderSystem.prototype.GetBankList = function (appid, reqtime) {
        return this.Compute(appid + "|" + reqtime);
    };
    return OrderSystem;
}());
exports.default = OrderSystem;
