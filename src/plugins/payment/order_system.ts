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
}

export default class OrderSystem {
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

  QuickPay(order: Order, paymentcodeRaw: any) {
    return this.Compute(this._createOrderMacData(order) + "|" + paymentcodeRaw);
  }

  Refund(params: {
    appid: string;
    zptransid: string;
    amount: string;
    description: string;
    timestamp: string;
  }) {
    return this.Compute(
      params.appid +
        "|" +
        params.zptransid +
        "|" +
        params.amount +
        "|" +
        params.description +
        "|" +
        params.timestamp
    );
  }

  GetOrderStatus(params: { appid: string; apptransid: string }) {
    return this.Compute(
      params.appid + "|" + params.apptransid + "|" + config.get("zalopay.key1")
    );
  }

  GetRefundStatus(params: {
    appid: string;
    mrefundid: string;
    timestamp: string;
  }) {
    return this.Compute(
      params.appid + "|" + params.mrefundid + "|" + params.timestamp
    );
  }

  GetBankList(params: { appid: string; reqtime: string }) {
    return this.Compute(params.appid + "|" + params.reqtime);
  }
}
