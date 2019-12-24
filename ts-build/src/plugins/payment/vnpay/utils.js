"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sortParams(params) {
    var key, properSorted = [];
    for (key in params) {
        if (params.hasOwnProperty(key)) {
            properSorted.push(key);
        }
    }
    properSorted.sort();
    var sorted = {};
    for (key = 0; key < properSorted.length; key++) {
        sorted[properSorted[key]] = params[properSorted[key]];
    }
    return sorted;
}
exports.sortParams = sortParams;
function sortOrder(order) {
    var properSorted = [];
    var orderSorted = {};
    for (var proper in order) {
        properSorted.push(proper);
    }
    properSorted.sort();
    for (var key = 0; key < properSorted.length; key++) {
        switch (properSorted[key]) {
            case "vnp_Amount":
                orderSorted.vnp_Amount = order.vnp_Amount;
                break;
            case "vnp_BankCode":
                orderSorted.vnp_BankCode = order.vnp_BankCode;
                break;
            case "vnp_Command":
                orderSorted.vnp_Command = order.vnp_Command;
                break;
            case "vnp_CreateDate":
                orderSorted.vnp_CreateDate = order.vnp_CreateDate;
                break;
            case "vnp_CurrCode":
                orderSorted.vnp_CurrCode = order.vnp_CurrCode;
                break;
            case "vnp_IpAddr":
                orderSorted.vnp_IpAddr = order.vnp_IpAddr;
                break;
            case "vnp_Locale":
                orderSorted.vnp_Locale = order.vnp_Locale;
                break;
            case "vnp_Merchant":
                orderSorted.vnp_Merchant = order.vnp_Merchant;
                break;
            case "vnp_OrderInfo":
                orderSorted.vnp_OrderInfo = order.vnp_OrderInfo;
                break;
            case "vnp_OrderType":
                orderSorted.vnp_OrderType = order.vnp_OrderType;
                break;
            case "vnp_ReturnUrl":
                orderSorted.vnp_ReturnUrl = order.vnp_ReturnUrl;
                break;
            case "vnp_TmnCode":
                orderSorted.vnp_TmnCode = order.vnp_TmnCode;
                break;
            case "vnp_TxnRef":
                orderSorted.vnp_TxnRef = order.vnp_TxnRef;
                break;
            case "vnp_SecureHashType":
                orderSorted.vnp_SecureHashType = order.vnp_SecureHashType;
                break;
            case "vnp_SecureHash":
                orderSorted.vnp_SecureHash = order.vnp_SecureHash;
                break;
            case "vnp_Version":
                orderSorted.vnp_Version = order.vnp_Version;
                break;
            default:
                break;
        }
    }
    return orderSorted;
}
exports.sortOrder = sortOrder;
