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
      (req, res) => {
        this.handler.GetOrder(req, res)
      }
    );

    router.post(
      "/create/:contractID",
      (req, res) => {
        this.handler.CreateOrder(req, res);
      }
    );

    router.get(
      "/callback",
      (req, res) => {
        this.handler.OrderCallback(req, res);
      }
    );

    router.get(
      "/ipn",
      (req, res) => {
        this.handler.InstantPaymentNotification(req, res);
      }
    );
  }
}
