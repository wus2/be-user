"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dateFormat = require("dateformat");
var vnpay_1 = __importDefault(require("../../plugins/payment/vnpay/vnpay"));
var contract_1 = require("../../plugins/database/contract/contract");
var PaymentHandler = /** @class */ (function () {
    function PaymentHandler() {
        this.payment = new vnpay_1.default();
        this.contractDB = new contract_1.ContractDB();
    }
    PaymentHandler.prototype.CreateOrder = function (req, res) {
        var _this = this;
        var contractID = Number(req.params.contractID);
        console.log(contractID);
        if (contractID == NaN || contractID < 0) {
            return res.json({
                code: -1,
                message: "Contract ID is empty"
            });
        }
        // var payload = res.locals.payload;
        // if (!payload) {
        //   return res.json({
        //     code: -1,
        //     message: "User payload is empty"
        //   });
        // }
        this.contractDB.getContract(contractID, function (err, data) {
            if (err) {
                return res.jsonp({
                    code: -1,
                    message: err.toString()
                });
            }
            var contract = data[0];
            if (!contract) {
                return res.json({
                    code: -1,
                    message: "Contract model is incorrect"
                });
            }
            var ipAddr = req.headers["x-forwarded-for"] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.remoteAddress;
            var date = new Date();
            var createDate = dateFormat(date, "yyyymmddHHmmss");
            var orderId = dateFormat(date, "HHmmss");
            var bankCode = req.body.bankCode;
            var orderInfo = req.body.orderDescription;
            var orderType = req.body.orderType;
            var locale = req.body.language;
            if (locale === null || locale === "" || locale == undefined) {
                locale = "vn";
            }
            if (!contract.rent_price || !contract.rent_time) {
                return res.json({
                    code: -1,
                    message: "Contract does not have rent price and time"
                });
            }
            var amount = contract.rent_price * contract.rent_time;
            var order = {
                vnp_Amount: amount * 100,
                vnp_CreateDate: createDate,
                vnp_Locale: locale,
                vnp_IpAddr: ipAddr,
                vnp_OrderType: orderType,
                vnp_OrderInfo: orderInfo,
                vnp_TxnRef: orderId
            };
            if (bankCode !== null && bankCode !== "") {
                order.vnp_BankCode = bankCode;
            }
            var entity = {
                cid: contractID,
                order_id: orderId,
                order_amount: amount,
                order_bank_code: bankCode,
                order_create_date: ~~(Date.now() / 1000),
                status: contract_1.ContractStatus.Created
            };
            _this.contractDB.updateContract(entity, function (err, data) {
                if (err) {
                    return res.json({
                        code: -1,
                        message: err.toString()
                    });
                }
                var resPay = _this.payment.CreateOrder(order);
                if (resPay.code != 1) {
                    return res.json({
                        code: resPay.code,
                        message: resPay.message
                    });
                }
                return res.status(200).json({
                    code: "1",
                    data: resPay.url
                });
            });
        });
    };
    // if error occures here, must refund for user
    PaymentHandler.prototype.OrderCallback = function (req, res) {
        var _this = this;
        var params = req.query;
        var resPay = this.payment.OrderCallback(params);
        if (resPay.code == 1) {
            var orderID = params["vnp_TxnRef"];
            if (!orderID) {
                return res.json({
                    code: -1,
                    message: "Order ID is empty"
                });
            }
            this.contractDB.getContractByOrderID(orderID, function (err, data) {
                if (err) {
                    return res.json({
                        code: -1,
                        message: err.toString()
                    });
                }
                var contract = data[0];
                if (!contract) {
                    return res.json({
                        code: -1,
                        message: "Contract model is incorrect"
                    });
                }
                if (contract.status != contract_1.ContractStatus.Created) {
                    return res.json({
                        code: -1,
                        message: "Contract does not create"
                    });
                }
                console.log(contract);
                var entity = {
                    id: contract.cid,
                    status: contract_1.ContractStatus.Bought
                };
                console.log(entity);
                _this.contractDB.updateContract(entity, function (err, data) {
                    if (err) {
                        return res.json({
                            code: -1,
                            message: err.toString()
                        });
                    }
                    return res.json({
                        code: 1,
                        message: "OK"
                    });
                });
            });
        }
        else {
            res.render("success", { code: "97" });
        }
    };
    PaymentHandler.prototype.InstantPaymentNotification = function (req, res) {
        var params = req.query;
        var resPay = this.payment.InstantPaymentNotification(params);
        if (resPay.code == 1) {
            res.status(200).json({ RspCode: "00", Message: "success" });
        }
        else {
            res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
        }
    };
    return PaymentHandler;
}());
exports.PaymentHandler = PaymentHandler;
