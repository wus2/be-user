"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var node_rsa_1 = __importDefault(require("node-rsa"));
var axios = require("axios").default;
var crypto_js_1 = __importDefault(require("crypto-js"));
var moment_1 = __importDefault(require("moment"));
var config_1 = __importDefault(require("config"));
var order_system_1 = __importDefault(require("./order_system"));
var ngrok_1 = __importDefault(require("./ngrok"));
var publicKey = fs_1.default.readFileSync("publickey.pem", "utf8");
var rsa = new node_rsa_1.default(publicKey, "pkcs1");
var uid = Date.now();
var ZaloPay = /** @class */ (function () {
    function ZaloPay() {
        var _this = this;
        this.orderSystem = new order_system_1.default();
        new ngrok_1.default().GetPublicURL().then(function (publicURL) {
            console.log("[Public_url]", publicURL);
            _this.publicURL = publicURL;
        });
    }
    ZaloPay.prototype.VerifyCallback = function (data, requestMac) {
        var result = {};
        var mac = crypto_js_1.default.HmacSHA256(data, config_1.default.get("zalopay.key2")).toString();
        if (mac !== requestMac) {
            result.code = -1;
            result.message = "mac not equal";
        }
        else {
            result.code = 1;
            result.message = "success";
        }
        return result;
    };
    ZaloPay.prototype.GenTransID = function () {
        return moment_1.default().format("YYMMDD") + "_" + config_1.default.get("zalopay.appid") + "_" + ++uid;
    };
    ZaloPay.prototype.NewOrder = function (amount, description) {
        var self = this;
        return {
            amount: amount,
            description: description,
            appid: config_1.default.get("zalopay.appid"),
            appuser: "Uber tutor",
            embeddata: JSON.stringify({
                forward_callback: self.publicURL + "/callback",
                description: description
            }),
            item: JSON.stringify([{ name: "demo item", amount: amount }]),
            apptime: Date.now(),
            apptransid: this.GenTransID()
        };
    };
    ZaloPay.prototype.CreateOrder = function (amount, description) {
        return __awaiter(this, void 0, void 0, function () {
            var order, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = this.NewOrder(amount, description);
                        order.mac = this.orderSystem.CreateOrder(order);
                        return [4 /*yield*/, axios.post(config_1.default.get("zalopay.api.createorder"), null, {
                                params: order
                            })];
                    case 1:
                        result = (_a.sent()).data;
                        result.apptransid = order.apptransid;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    ZaloPay.prototype.Gateway = function (amount, description) {
        var order = this.NewOrder(amount, description);
        order.mac = this.orderSystem.CreateOrder(order);
        var orderJSON = JSON.stringify(order);
        var b64Order = Buffer.from(orderJSON).toString("base64");
        return config_1.default.get("zalopay.api.gateway") + encodeURIComponent(b64Order);
    };
    ZaloPay.prototype.QuickPay = function (amount, description, paymentcodeRaw) {
        return __awaiter(this, void 0, void 0, function () {
            var order, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = this.NewOrder(amount, description);
                        order.userip = "127.0.0.1";
                        order.paymentcode = rsa.encrypt(paymentcodeRaw, "base64");
                        order.mac = this.orderSystem.QuickPay(order, paymentcodeRaw);
                        return [4 /*yield*/, axios.post(config_1.default.get("zalopay.api.quickpay"), null, {
                                params: order
                            })];
                    case 1:
                        result = (_a.sent()).data;
                        result.apptransid = order.apptransid;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    ZaloPay.prototype.GetOrderStatus = function (apptransid) {
        if (apptransid === void 0) { apptransid = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var order, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order = {};
                        order.appid = config_1.default.get("zalopay.appid");
                        order.mac = this.orderSystem.GetOrderStatus(order.appid, apptransid);
                        return [4 /*yield*/, axios.post(config_1.default.get("zalopay.api.getorderstatus"), null, {
                                params: order
                            })];
                    case 1:
                        result = (_a.sent()).data;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    ZaloPay.prototype.Refund = function (zptransid, amount, description) {
        return __awaiter(this, void 0, void 0, function () {
            var transID, appid, refundTime, refundReq, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transID = this.GenTransID();
                        if (!transID) {
                            return [2 /*return*/];
                        }
                        appid = config_1.default.get("zalopay.appid");
                        if (!appid) {
                            return [2 /*return*/];
                        }
                        refundTime = Date.now();
                        refundReq = {
                            appid: appid,
                            zptransid: zptransid,
                            amount: amount,
                            description: description,
                            timestamp: refundTime,
                            mrefundid: transID
                        };
                        refundReq.mac = this.orderSystem.Refund(appid, zptransid, amount, description, refundTime);
                        return [4 /*yield*/, axios.post(config_1.default.get("zalopay.api.refund"), null, {
                                params: refundReq
                            })];
                    case 1:
                        result = (_a.sent()).data;
                        result.mrefundid = refundReq.mrefundid;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    ZaloPay.prototype.GetRefundStatus = function (mrefundid) {
        return __awaiter(this, void 0, void 0, function () {
            var appid, timestamp, mac, order, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appid = config_1.default.get("zalopay.appid");
                        timestamp = Date.now();
                        mac = this.orderSystem.GetRefundStatus(appid, mrefundid, timestamp);
                        order = {
                            appid: appid,
                            mrefundid: mrefundid,
                            timestamp: timestamp
                        };
                        return [4 /*yield*/, axios.post(config_1.default.get("zalopay.api.getrefundstatus"), null, {
                                params: order
                            })];
                    case 1:
                        result = (_a.sent()).data;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    ZaloPay.prototype.GetBankList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var appid, reqtime, mac, order, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appid = config_1.default.get("zalopay.appid");
                        reqtime = Date.now();
                        mac = this.orderSystem.GetBankList(appid, reqtime);
                        order = {
                            appid: appid,
                            timestamp: reqtime,
                            mac: mac
                        };
                        return [4 /*yield*/, axios.post(config_1.default.get("zalopay.api.getbanklist"), null, {
                                params: order
                            })];
                    case 1:
                        result = (_a.sent()).data;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return ZaloPay;
}());
exports.default = ZaloPay;
