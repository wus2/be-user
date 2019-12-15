import { expect } from "chai";
import "mocha";

import { Model, HistoryDB } from "./history";

var db = new HistoryDB();

describe("Test set history", () => {
  it("should return success", () => {
    var history = {
      uid: 32,
      desc: "Day tieng anh o HCMUS",
      start_time: Date.now(),
      amount: 100000
    };
    db.setHistory(history, (err: any, data: any) => {
      expect(err).to.null;
      console.log("DATA:", data);
    });
  });
});
