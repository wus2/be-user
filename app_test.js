// import { HistoryDB } from "./plugins/database/history/history";
var Mysql = require("./plugins/database/mysql");

console.log(Mysql);
console.log(Mysql.ping());

// Mysql.get("user", "id", 2)
//   .then(data => {
//     console.log(data);
//   })
//   .catch(err => {
//     console.log(err);
//   });
// var history = new HistoryDB();
// var mysql = new Mysql();

// mysql
//   .get("history", "id", 1)
//   .then(data => {
//     console.log(data);
//   })
//   .catch(err => {
//     console.log(err);
//   });

// history.getHistory(1, (err: any, data: any) => {
//   console.log(err);
//   console.log(data);
// });

// console.log(history);
