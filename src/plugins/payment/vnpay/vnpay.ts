import { Router, NextFunction, Request, Response } from "express";
import { sortOrder, sortParams } from "./utils";
var dateFormat = require("dateformat");
var config = require("config");
var dateFormat = require("dateformat");
var querystring = require("qs");
var sha256 = require("sha256");

export interface VNpayOrder {
  vnp_Amount?: number;
  vnp_BankCode?: string;
  vnp_Command?: string;
  vnp_CreateDate?: string;
  vnp_CurrCode?: string;
  vnp_IpAddr?: string;
  vnp_Locale?: string;
  vnp_Merchant?: string;
  vnp_OrderInfo?: string;
  vnp_OrderType?: string;
  vnp_ReturnUrl?: string;
  vnp_TmnCode?: string;
  vnp_TxnRef?: any;
  vnp_SecureHashType?: string;
  vnp_SecureHash?: string;
  vnp_Version?: string;
}

export interface IPayment {
  CreateOrder(order: VNpayOrder): any;
  OrderCallback(vnp_Params: any): any;
  InstantPaymentNotification(vnp_Params: any): any;
}

export default class Payment implements IPayment {
  constructor() {}

  CreateOrder(order: VNpayOrder) {
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

    order = sortOrder(order);
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
  }

  OrderCallback(vnp_Params: any) {
    var secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortParams(vnp_Params);

    var tmnCode = config.get("vnp_TmnCode");
    var secretKey = config.get("vnp_HashSecret");

    var signData =
      secretKey + querystring.stringify(vnp_Params, { encode: false });

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
  }

  InstantPaymentNotification(vnp_Params: any) {
    var secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortParams(vnp_Params);

    var secretKey = config.get("vnp_HashSecret");
    var signData =
      secretKey + querystring.stringify(vnp_Params, { encode: false });

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
  }
}
