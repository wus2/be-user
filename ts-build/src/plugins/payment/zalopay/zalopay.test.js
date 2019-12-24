"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var zalopay_1 = __importDefault(require("./zalopay"));
var zalopay = new zalopay_1.default();
zalopay
    .CreateOrder(1000, "An chuyen tien cho Dung")
    .then(function (data) {
    console.log(data.apptransid);
    setTimeout(function () {
        zalopay
            .GetOrderStatus(data.apptransid)
            .then(function (data) {
            console.log(data);
        })
            .catch(function (err) {
            console.log(err);
        });
    }, 10000);
})
    .catch(function (err) {
    console.log(err);
});
// console.log(zalopay.Gateway(1000, ""));
