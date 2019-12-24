import CryptoJS from "crypto-js";
import config from "config";

export interface Order {
  appid?: number;
  apptransid?: string;
  appuser?: string;
  amount?: number;
  apptime?: number;
  embeddata?: any;
  item?: any;
  mac?: string;
  zptransid?: string;
  description?: string;
  timestamp?: number;
  mrefundid?: number;
  userip?: string;
  paymentcode?: string;
}

export interface IOrderSystem {
  CreateOrder(order: Order): string;
  QuickPay(order: Order, paymentcodeRaw: number): string;
  Refund(
    appid: number,
    zptransid: string,
    amount: number,
    description: string,
    timestamp: number
  ): string;
  GetOrderStatus(appid: number, apptransid: string): string;
  GetRefundStatus(appid: number, mrefundid: number, timestamp: number): string;
  GetBankList(appid: number, reqtime: number): string;
}

export default class OrderSystem implements IOrderSystem {
  Compute(data: any) {
    return CryptoJS.HmacSHA256(data, config.get("zalopay.key1")).toString();
  }

  _createOrderMacData(order: Order) {
    return (
      order.appid +
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
      order.item
    );
  }

  CreateOrder(order: Order) {
    return this.Compute(this._createOrderMacData(order));
  }

  QuickPay(order: Order, paymentcodeRaw: number) {
    return this.Compute(this._createOrderMacData(order) + "|" + paymentcodeRaw);
  }

  Refund(
    appid: number,
    zptransid: string,
    amount: number,
    description: string,
    timestamp: number
  ) {
    return this.Compute(
      appid +
        "|" +
        zptransid +
        "|" +
        amount +
        "|" +
        description +
        "|" +
        timestamp
    );
  }

  GetOrderStatus(appid: number, apptransid: string) {
    return this.Compute(
      appid + "|" + apptransid + "|" + config.get("zalopay.key1")
    );
  }

  GetRefundStatus(appid: number, mrefundid: number, timestamp: number) {
    return this.Compute(appid + "|" + mrefundid + "|" + timestamp);
  }

  GetBankList(appid: number, reqtime: number) {
    return this.Compute(appid + "|" + reqtime);
  }
}
