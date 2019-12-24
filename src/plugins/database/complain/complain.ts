import mysql, { IMysql } from "../mysql";

export interface ComplainModel {
  id?: number;
  from_uid?: number;
  to_uid?: number;
  contract_id?: number;
  description?: string;
  complain_time?: number;
}

export interface IComplainDB {
  setComlain(complain: ComplainModel, callback: Function): void;
  getDetailComplain(comID: number, callback: Function): void;
  getListComplain(offset: number, limit: number, callback: Function): void;
}

export class ComplainDB implements IComplainDB {
  db: IMysql;
  tableName: string;
  constructor() {
    this.db = mysql;
    this.tableName = "complain";
  }

  setComlain(complain: ComplainModel, callback: Function) {
    this.db
      .add(this.tableName, complain)
      .then(data => {
        if (data) {
          return callback(null, data);
        }
        return callback(new Error("Set complain failed"));
      })
      .catch((err: Error) => {
        console.log("[ComplainDB][setComplain][err]", err);
        return callback(new Error("Set complain failed"));
      });
  }

  getDetailComplain(comID: number, callback: Function) {
    this.db
      .get(this.tableName, "id", comID)
      .then((data: any) => {
        if (data && data.length > 0) {
          return callback(null, data);
        }
        return callback(new Error("Get complain failed"));
      })
      .catch((err: Error) => {
        console.log("[ComplainDB][getComplain][err]", err);
        return callback(new Error("Get complain failed"));
      });
  }

  getListComplain(offset: number, limit: number, callback: Function) {
    var sql = `select * from ${this.tableName} limit ${offset}, ${limit}`;
    this.db
      .load(sql)
      .then((data: any) => {
        if (data && data.length > 0) {
          return callback(null, data);
        }
        return callback(new Error("Get list complain failed"));
      })
      .catch((err: Error) => {
        console.log("[ComplainDB][getListComplain][err]", err);
        return callback(new Error("Get list complain failed"));
      });
  }
}
