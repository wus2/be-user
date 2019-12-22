// import fs from "fs";
// import NodeRSA from "node-rsa";
// const axios = require("axios").default;
// import CryptoJS from "crypto-js";
// import moment from "moment";

// import config from "config";
// import OrderSystem from "./order_system";
// import Ngrok from "./ngrok";

// interface ReturnError {
//     code?:number
//     message?:string
// }

// const publicKey = fs.readFileSync("publickey.pem", "utf8");
// const rsa = new NodeRSA(publicKey,  "pkcs1");

// let uid = Date.now();

// export default class ZaloPay {
//   publicURL: any;
//   constructor() {
//     new Ngrok().GetPublicURL().then(publicURL => {
//       console.log("[Public_url]", publicURL);
//       this.publicURL = publicURL;
//     });
//   }

//   VerifyCallback(data: string | CryptoJS.LibWordArray, requestMac: string) {
//     const result ={} as ReturnError
//     const mac = CryptoJS.HmacSHA256(
//       data,
//       config.get("zalopay.key2")
//     ).toString();

//     if (mac !== requestMac) {
//       result.code = -1;
//       result.message = "mac not equal";
//     } else {
//       result.code = 1;
//       result.message = "success";
//     }

//     return result;
//   }

//   GenTransID() {
//     return `${moment().format("YYMMDD")}_${config.get(
//       "zalopay.appid"
//     )}_${++uid}`;
//   }

//   NewOrder({ amount, description }) {
//     const self = this;
//     return {
//       amount,
//       description,
//       appid: config.get("zalopay.appid"),
//       appuser: "Demo",
//       embeddata: JSON.stringify({
//         forward_callback: self.publicURL + "/callback",
//         description
//       }),
//       item: JSON.stringify([{ name: "demo item", amount }]),
//       apptime: Date.now(),
//       apptransid: this.GenTransID()
//     };
//   }

//   async CreateOrder(params = {}) {
//     const order = this.NewOrder(params);
//     order.mac = OrderSystem.CreateOrder(order);

//     const { data: result } = await axios.post(
//       config.get("zalopay.api.createorder"),
//       null,
//       {
//         params: order
//       }
//     );

//     result.apptransid = order.apptransid;
//     return result;
//   }

//   Gateway(params = {}) {
//     const order = this.NewOrder(params);
//     order.mac = OrderSystem.CreateOrder(order);

//     const orderJSON = JSON.stringify(order);
//     const b64Order = Buffer.from(orderJSON).toString("base64");
//     return config.get("zalopay.api.gateway") + encodeURIComponent(b64Order);
//   }

//   async QuickPay(params = {}) {
//     const order = this.NewOrder(params);
//     order.userip = "127.0.0.1";
//     order.paymentcode = rsa.encrypt(params.paymentcodeRaw, "base64");
//     order.mac = OrderSystem.QuickPay(order, params.paymentcodeRaw);

//     const { data: result } = await axios.post(
//       config.get("zalopay.api.quickpay"),
//       null,
//       {
//         params: order
//       }
//     );

//     result.apptransid = order.apptransid;
//     return result;
//   }

//   async GetOrderStatus(apptransid = "") {
//     const params = {
//       appid: config.get("zalopay.appid"),
//       apptransid
//     };
//     params.mac = OrderSystem.GetOrderStatus(params);

//     const { data: result } = await axios.post(
//       config.get("zalopay.api.getorderstatus"),
//       null,
//       {
//         params
//       }
//     );

//     return result;
//   }

//   async Refund({ zptransid, amount, description }) {
//     const refundReq = {
//       appid: config.get("zalopay.appid"),
//       zptransid,
//       amount,
//       description,
//       timestamp: Date.now(),
//       mrefundid: this.GenTransID()
//     };

//     refundReq.mac = OrderSystem.Refund(refundReq);

//     const { data: result } = await axios.post(
//       config.get("zalopay.api.refund"),
//       null,
//       {
//         params: refundReq
//       }
//     );

//     result.mrefundid = refundReq.mrefundid;
//     return result;
//   }

//   async GetRefundStatus(mrefundid: any) {
//     const params = {
//       appid: config.get("zalopay.appid"),
//       mrefundid,
//       timestamp: Date.now()
//     };

//     params.mac = OrderSystem.GetRefundStatus(params);

//     const { data: result } = await axios.post(
//       config.get("zalopay.api.getrefundstatus"),
//       null,
//       {
//         params
//       }
//     );

//     return result;
//   }

//   async GetBankList() {
//     const params = {
//       appid: config.get("zalopay.appid"),
//       reqtime: Date.now()
//     };

//     params.mac = OrderSystem.GetBankList(params);

//     const { data: result } = await axios.post(
//       config.get("zalopay.api.getbanklist"),
//       null,
//       {
//         params
//       }
//     );

//     return result;
//   }
// }
