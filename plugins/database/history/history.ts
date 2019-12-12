// import mysql, { IMysql } from "../mysql";

// export interface Model {
//   id?: number;
//   uid?: number;
//   desc?: string;
//   start_time?: number;
//   amount?: number;
// }

// export class HistoryDB {
//   db: IMysql;
//   tableName: string;
//   constructor() {
//     this.db =  mysql;
//     this.tableName = "history";
//   }

//   setHistory(history: Model, callback: Function) {
//     this.db
//       .add(this.tableName, history)
//       .then(data => {
//         callback(null, data);
//       })
//       .catch(err => {
//         console.log("[HistoryDB][setHistory][err]", err);
//         callback(new Error("Set history failed"));
//       });
//   }

//   getHistory(hisID: number, callback: Function) {
//     this.db
//       .get(this.tableName, "id", hisID)
//       .then(data => {
//         callback(null, data);
//       })
//       .catch(err => {
//         console.log("[HistoryDB][getHistory][err]", err);
//         callback(new Error("Set history failed"));
//       });
//   }
// }
