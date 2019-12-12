// import { HistoryDB } from "./plugins/database/history/history";
import Mysql from "./plugins/database/mysql";

console.log(Mysql);
// var history = new HistoryDB();
var mysql = new Mysql();

mysql
  .get("history", "id", 1)
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.log(err);
  });

// history.getHistory(1, (err: any, data: any) => {
//   console.log(err);
//   console.log(data);
// });

// console.log(history);
