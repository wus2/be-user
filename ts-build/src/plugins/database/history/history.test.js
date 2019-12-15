"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var history_1 = require("./history");
var db = new history_1.HistoryDB();
describe("Test set history", function () {
    it("should return success", function () {
        var history = {
            uid: 32,
            desc: "Day tieng anh o HCMUS",
            start_time: Date.now(),
            amount: 100000
        };
        db.setHistory(history, function (err, data) {
            chai_1.expect(err).to.null;
            console.log("DATA:", data);
        });
    });
});
