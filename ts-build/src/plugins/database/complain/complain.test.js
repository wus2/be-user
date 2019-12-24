"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var complain_1 = require("./complain");
var complainDB = new complain_1.ComplainDB();
var complain = {
    from_uid: 25,
    to_uid: 35,
    contract_id: 5,
    description: "Ban nay day thieu toi mot ngay",
    complain_time: ~~(Date.now() / 1000)
};
complainDB.setComlain(complain, function (err, data) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Set", data);
    }
});
complainDB.getDetailComplain(1, function (err, data) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Get detail", data);
    }
});
