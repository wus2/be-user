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
    OrderSystem.prototype.Refund = function (params) {
        return this.Compute(params.appid +
            "|" +
            params.zptransid +
            "|" +
            params.amount +
            "|" +
            params.description +
            "|" +
            params.timestamp);
    };
    OrderSystem.prototype.GetOrderStatus = function (params) {
        return this.Compute(params.appid + "|" + params.apptransid + "|" + config_1.default.get("zalopay.key1"));
    };
    OrderSystem.prototype.GetRefundStatus = function (params) {
        return this.Compute(params.appid + "|" + params.mrefundid + "|" + params.timestamp);
    };
    OrderSystem.prototype.GetBankList = function (params) {
        return this.Compute(params.appid + "|" + params.reqtime);
    };
    return OrderSystem;
}());
exports.default = OrderSystem;
