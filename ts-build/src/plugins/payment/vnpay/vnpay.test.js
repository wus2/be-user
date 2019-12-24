"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var order = {
    vnp_Amount: 100,
    vnp_CreateDate: "123",
    vnp_BankCode: "123",
    vnp_Command: "pay",
    vnp_CurrCode: "VND"
};
utils_1.sortOrder(order);
