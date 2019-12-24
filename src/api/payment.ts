import { Router, NextFunction, Request, Response, response } from "express";
import Payment, { IPayment } from "../plugins/payment/vnpay/vnpay";
import Authenticate from "../plugins/middlewares/authen";
import { IPaymentHandler, PaymentHandler } from "../handler/payment/payment";
var dateFormat = require("dateformat");

export class PaymentRoute {
  handler: IPaymentHandler;
  constructor() {
    this.handler = new PaymentHandler();
  }
  public create(router: Router) {
    router.get("/", (req, res) => {
      res.render("orderlist", { title: "Danh sách hợp đồng" });
    });

    router.get(
      "/create/:contractID",
      // (req, res, next) => {
      //   Authenticate.forUser(req, res, next);
      // },
      (req, res) => {
        var contractID = Number(req.params.contractID);
        if (!contractID || contractID < 0) {
          return res.json({
            code: -1,
            message: "Contract ID is incorrect"
          });
        }
        var date = new Date();
        var desc =
          "Thanh toan don hang thoi gian: " +
          dateFormat(date, "yyyy-mm-dd HH:mm:ss");
        res.render("order", {
          title: "Tạo mới đơn hàng",
          amount: 10000,
          description: desc,
          contractID: contractID
        });
      }
    );

    router.post(
      "/create/:contractID",
      // (req, res, next) => {
      //   Authenticate.forUser(req, res, next);
      // },
      (req, res) => {
        this.handler.CreateOrder(req, res);
      }
    );

    router.get(
      "/callback",
      // (req, res, next) => {
      //   Authenticate.forUser(req, res, next);
      // },
      (req, res) => {
        this.handler.OrderCallback(req, res);
      }
    );

    router.get(
      "/ipn",
      // (req, res, next) => {
      //   Authenticate.forUser(req, res, next);
      // },
      (req, res) => {
        this.handler.InstantPaymentNotification(req, res);
      }
    );
  }
}
