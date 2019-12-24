import { Request, Response } from "express";
var dateFormat = require("dateformat");
import Payment, {
  VNpayOrder,
  IPayment
} from "../../plugins/payment/vnpay/vnpay";
import {
  IContractDB,
  ContractDB,
  ContractModel,
  ContractStatus
} from "../../plugins/database/contract/contract";
import { create } from "domain";

export interface IPaymentHandler {
  CreateOrder(req: Request, res: Response): void;
  OrderCallback(req: Request, res: Response): void;
  InstantPaymentNotification(req: Request, res: Response): void;
}

export class PaymentHandler implements IPaymentHandler {
  payment: IPayment;
  contractDB: IContractDB;
  constructor() {
    this.payment = new Payment();
    this.contractDB = new ContractDB();
  }

  CreateOrder(req: Request, res: Response) {
    var contractID = Number(req.params.contractID);
    if (contractID == NaN || contractID < 0) {
      return res.json({
        code: -1,
        message: "Contract ID is empty"
      });
    }
    var payload = res.locals.payload;
    if (!payload) {
      return res.json({
        code: -1,
        message: "User payload is empty"
      });
    }

    this.contractDB.getContract(contractID, (err: Error, data: any) => {
      if (err) {
        return res.jsonp({
          code: -1,
          message: err.toString()
        });
      }
      var contract = data[0] as ContractModel;
      if (!contract) {
        return res.json({
          code: -1,
          message: "Contract model is incorrect"
        });
      }

      var ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.remoteAddress;

      var date = new Date();
      var createDate = dateFormat(date, "yyyymmddHHmmss");
      var orderId = dateFormat(date, "HHmmss");
      var amount = req.body.amount;
      var bankCode = req.body.bankCode;

      var orderInfo = req.body.orderDescription;
      var orderType = req.body.orderType;
      var locale = req.body.language;
      if (locale === null || locale === "" || locale == undefined) {
        locale = "vn";
      }

      var order = {
        vnp_Amount: amount * 100,
        vnp_CreateDate: createDate,
        vnp_Locale: locale,
        vnp_IpAddr: ipAddr,
        vnp_OrderType: orderType,
        vnp_OrderInfo: orderInfo,
        vnp_TxnRef: orderId
      } as VNpayOrder;

      if (bankCode !== null && bankCode !== "") {
        order.vnp_BankCode = bankCode;
      }

      // update to database
      var entity = {
        id: contractID,
        order_id: orderId,
        order_amount: amount * 100,
        order_bank_code: bankCode,
        order_create_date: createDate,
        status: ContractStatus.Created
      } as ContractModel;

      this.contractDB.updateContract(entity, (err: Error, data: any) => {
        if (err) {
          return res.json({
            code: -1,
            message: err.toString()
          });
        }
        var resPay = this.payment.CreateOrder(order);
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
  }

  // if error occures here, must refund for user
  OrderCallback(req: Request, res: Response) {
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
      this.contractDB.getContractByOrderID(orderID, (err: Error, data: any) => {
        if (err) {
          return res.json({
            code: -1,
            message: err.toString()
          });
        }
        var contract = data[0] as ContractModel;
        if (!contract) {
          return res.json({
            code: -1,
            message: "Contract model is incorrect"
          });
        }
        if (contract.status != ContractStatus.Created) {
          return res.json({
            code: -1,
            message: "Contract does not create"
          });
        }
        var entity = {
          id: contract.id,
          status: ContractStatus.Bought
        } as ContractModel;
        this.contractDB.updateContract(entity, (err: Error, data: any) => {
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
    } else {
      res.render("success", { code: "97" });
    }
  }

  InstantPaymentNotification(req: Request, res: Response) {
    var params = req.query;

    var resPay = this.payment.InstantPaymentNotification(params);
    if (resPay.code == 1) {
      res.status(200).json({ RspCode: "00", Message: "success" });
    } else {
      res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
    }
  }
}
