import fs from "fs";
import NodeRSA from "node-rsa";
const axios = require("axios").default;
import CryptoJS from "crypto-js";
import moment from "moment";

import config from "config";
import OrderSystem, { Order, IOrderSystem } from "./order_system";
import Ngrok from "./ngrok";
import { resolve } from "dns";

interface ReturnError {
  code?: number;
  message?: string;
}

const publicKey = fs.readFileSync("publickey.pem", "utf8");
const rsa = new NodeRSA(publicKey, "pkcs8-public");
let uid = Date.now();

export default class ZaloPay {
  orderSystem: IOrderSystem;
  publicURL: any;
  constructor() {
    this.orderSystem = new OrderSystem();
    new Ngrok().GetPublicURL().then(publicURL => {
      console.log("[Public_url]", publicURL);
      this.publicURL = publicURL;
    });
  }

  VerifyCallback(data: string | CryptoJS.LibWordArray, requestMac: string) {
    const result = {} as ReturnError;
    const mac = CryptoJS.HmacSHA256(
      data,
      config.get("zalopay.key2")
    ).toString();

    if (mac !== requestMac) {
      result.code = -1;
      result.message = "mac not equal";
    } else {
      result.code = 1;
      result.message = "success";
    }

    return result;
  }

  GenTransID() {
    return `${moment().format("YYMMDD")}_${config.get(
      "zalopay.appid"
    )}_${++uid}`;
  }

  NewOrder(amount: number, description: string) {
    const self = this;
    return {
      amount,
      description,
      appid: config.get("zalopay.appid"),
      appuser: "Uber tutor",
      embeddata: JSON.stringify({
        forward_callback: self.publicURL + "/callback",
        description
      }),
      item: JSON.stringify([{ name: "demo item", amount }]),
      apptime: Date.now(),
      apptransid: this.GenTransID()
    } as Order;
  }

  async CreateOrder(amount: number, description: string) {
    const order = this.NewOrder(amount, description);
    order.mac = this.orderSystem.CreateOrder(order);

    const { data: result } = await axios.post(
      config.get("zalopay.api.createorder"),
      null,
      {
        params: order
      }
    );

    result.apptransid = order.apptransid;
    return result;
  }

  Gateway(amount: number, description: string) {
    const order = this.NewOrder(amount, description);
    order.mac = this.orderSystem.CreateOrder(order);

    const orderJSON = JSON.stringify(order);
    const b64Order = Buffer.from(orderJSON).toString("base64");
    return config.get("zalopay.api.gateway") + encodeURIComponent(b64Order);
  }

  async QuickPay(amount: number, description: string, paymentcodeRaw: number) {
    const order = this.NewOrder(amount, description);
    order.userip = "127.0.0.1";
    order.paymentcode = rsa.encrypt(paymentcodeRaw as unknown as Buffer, "base64");
    order.mac = this.orderSystem.QuickPay(order, paymentcodeRaw);

    const { data: result } = await axios.post(
      config.get("zalopay.api.quickpay"),
      null,
      {
        params: order
      }
    );

    result.apptransid = order.apptransid;
    return result;
  }

  async GetOrderStatus(apptransid: string) {
    var order = {} as Order;
    order.appid = config.get("zalopay.appid") as number;
    order.mac = this.orderSystem.GetOrderStatus(order.appid, apptransid);

    const { data: result } = await axios.post(
      config.get("zalopay.api.getorderstatus"),
      null,
      {
        params: order
      }
    );

    return result;
  }

  async Refund(zptransid: string, amount: number, description: string) {
    var transID = (this.GenTransID() as unknown) as number;
    if (!transID) {
      return;
    }
    var appid = config.get("zalopay.appid") as number;
    if (!appid) {
      return;
    }
    var refundTime = Date.now();
    const refundReq = {
      appid: appid,
      zptransid,
      amount,
      description,
      timestamp: refundTime,
      mrefundid: transID
    } as Order;

    refundReq.mac = this.orderSystem.Refund(
      appid,
      zptransid,
      amount,
      description,
      refundTime
    );

    const { data: result } = await axios.post(
      config.get("zalopay.api.refund"),
      null,
      {
        params: refundReq
      }
    );

    result.mrefundid = refundReq.mrefundid;
    return result;
  }

  async GetRefundStatus(mrefundid: any) {
    var appid = config.get("zalopay.appid") as number;
    var timestamp = Date.now();

    var mac = this.orderSystem.GetRefundStatus(appid, mrefundid, timestamp);

    var order = {
      appid: appid,
      mrefundid: mrefundid,
      timestamp: timestamp
    } as Order;

    const { data: result } = await axios.post(
      config.get("zalopay.api.getrefundstatus"),
      null,
      {
        params: order
      }
    );

    return result;
  }

  async GetBankList() {
    var appid = config.get("zalopay.appid") as number;
    var reqtime = Date.now();
    var mac = this.orderSystem.GetBankList(appid, reqtime);
    var order = {
      appid: appid,
      timestamp: reqtime,
      mac: mac
    } as Order;

    const { data: result } = await axios.post(
      config.get("zalopay.api.getbanklist"),
      null,
      {
        params: order
      }
    );

    return result;
  }
}
