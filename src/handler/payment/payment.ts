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
import {
  INotificationDB,
  NotificationDB,
  NotificationModel
} from "../../plugins/database/notification/notification";
import { GetPaidDesciption } from "../../plugins/sse/notification";
import UserDB, { IUserDB, UserModel } from "../../plugins/database/user/user";

export interface IPaymentHandler {
  GetOrder(req: Request, res: Response): void;
  CreateOrder(req: Request, res: Response): void;
  OrderCallback(req: Request, res: Response): void;
  InstantPaymentNotification(req: Request, res: Response): void;
}

export class PaymentHandler implements IPaymentHandler {
  payment: IPayment;
  contractDB: IContractDB;
  userDB: IUserDB;
  notiDB: INotificationDB;

  constructor() {
    this.payment = new Payment();
    this.contractDB = new ContractDB();
    this.userDB = new UserDB();
    this.notiDB = new NotificationDB();
  }

  GetOrder(req: Request, res: Response) {
    var contractID = Number(req.params.contractID);
    if (!contractID || contractID < 0) {
      return res.json({
        code: -1,
        message: "Contract ID is incorrect"
      });
    }
    this.contractDB.getContract(contractID, (err: Error, data: any) => {
      if (err) {
        return res.render("error", { message: "Lấy hợp đồng bị lỗi" });
      }
      var contract = data[0] as ContractModel;
      if (!contract || !contract.rent_time || !contract.rent_price) {
        return res.render("error", { message: "Lấy hợp đồng bị lỗi" });
      }
      var date = new Date();
      var desc =
        "Thanh toan don hang thoi gian: " +
        dateFormat(date, "yyyy-mm-dd HH:mm:ss");
      res.render("order", {
        title: "Tạo mới đơn hàng",
        amount: contract.rent_price * contract.rent_time,
        description: desc,
        contractID: contractID
      });
    });
  }

  CreateOrder(req: Request, res: Response) {
    var contractID = Number(req.params.contractID);
    console.log(contractID);
    if (contractID == NaN || contractID < 0) {
      return res.json({
        code: -1,
        message: "Contract ID is empty"
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
      var orderId = ~~(Date.now() / 1000);
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
      } as VNpayOrder;

      if (bankCode !== null && bankCode !== "") {
        order.vnp_BankCode = bankCode;
      }

      var entity = {
        cid: contractID,
        order_id: orderId,
        order_amount: amount,
        order_bank_code: bankCode,
        order_create_date: ~~(Date.now() / 1000),
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

  // if error occures here, we must be refund for user :(
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
          cid: contract.cid,
          status: ContractStatus.Finished
        } as ContractModel;
        this.contractDB.updateContract(entity, (err: Error, data: any) => {
          if (err) {
            return res.json({
              code: -1,
              message: err.toString()
            });
          }

          if (!contract.tutee_id) {
            return res.render("success", { code: "97" });
          }
          this.userDB.getByID(contract.tutee_id, (err: Error, data: any) => {
            if (err) {
              console.log("[PaymentHandler][OrderCallback][err]", err);
              return res.render("success", { code: "97" });
            }
          });
          var tutee = data[0] as UserModel;
          if (!tutee) {
            console.log(
              "[PaymentHandler][OrderCallback][err] tutee model is incorrect"
            );
            return res.render("success", { code: "97" });
          }
          var noti = {
            user_id: contract.tutor_id,
            from_name: tutee.name,
            contract_id: contract.cid,
            description: GetPaidDesciption(tutee.name),
            create_time: ~~(Date.now() / 1000)
          } as NotificationModel;
          this.notiDB.setNotification(noti, (err: Error, data: any) => {
            if (err) {
              console.log("[PaymentHandler][OrderCallback][err]", err);
              return res.render("success", { code: "97" });
            }
            return res.render("success", { code: "00" });
          });
        });
      });
    } else {
      return res.render("success", { code: "97" });
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
