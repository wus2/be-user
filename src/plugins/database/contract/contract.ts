import mysql, { IMysql } from "../mysql";
import { Role } from "../user/user";

export enum ContractStatus {
  Draft = 0,
  Pending = 1,
  Approved = 2,
  Created = 3,
  Bought = 4,
  Closed = 5,
  Refund = 6,
  Expired = 7,
  Finished = 8
}

export interface ContractModel {
  id?: number;
  tutor_id?: number;
  tutee_id?: number;
  desc?: string;
  start_time?: number;
  rent_time?: number;
  rent_price?: number;
  create_time?: number;
  status?: number;
  order_id?: number;
  order_amount?: number;
  order_bank_code?: string;
  order_create_date?: number;
  stars?: number;
  comment?: string;
}

export interface IContractDB {
  db: IMysql;
  tableName: string;
  setContract(Contract: ContractModel, callback: Function): void;
  getContract(conID: number, callback: Function): void;
  updateContract(contract: ContractModel, callback: Function): void;
  getListContract(
    userID: number,
    role: number,
    offset: number,
    limit: number,
    callback: Function
  ): void;
  getContractByOrderID(orderID: number, callback: Function): void;
}

export class ContractDB implements IContractDB {
  db: IMysql;
  tableName: string;
  constructor() {
    this.db = mysql;
    this.tableName = "contract";
  }

  setContract(contract: ContractModel, callback: Function) {
    this.db
      .add(this.tableName, contract)
      .then(data => {
        if (data) {
          return callback(null, data);
        }
        return callback(new Error("Set contract failed"));
      })
      .catch(err => {
        console.log("[ContractDB][setContract][err]", err);
        return callback(new Error("Set contract failed"));
      });
  }

  getContract(conID: number, callback: Function) {
    this.db
      .get(this.tableName, "id", conID)
      .then(data => {
        if (data) {
          return callback(null, data);
        }
        return callback(new Error("Get contract failed"));
      })
      .catch(err => {
        console.log("[ContractDB][getContract][err]", err);
        return callback(new Error("Get Contract failed"));
      });
  }

  updateContract(contract: ContractModel, callback: Function) {
    this.db
      .update(this.tableName, "id", contract)
      .then((data: any) => {
        if (data < 0) {
          return callback(new Error("Update database failed"));
        }
        return callback(null, data);
      })
      .catch((err: Error) => {
        console.log("[ContractDB][updateContract][err]", err);
        return callback(new Error("Update database failed"));
      });
  }

  getListContract(
    userID: number,
    role: number,
    offset: number,
    limit: number,
    callback: Function
  ) {
    if (offset < 0 || limit < 0) {
      return callback(new Error("Offset or limit is incorrect"));
    }
    if (userID < 0 || !isValidRole(role)) {
      return callback(new Error("UserID or role is invalid"));
    }
    var sql = `select * from ${this.tableName}`;
    if (role == Role.Tutor) {
      sql += ` where tutor_id = ${userID}`;
    } else if (role == Role.Tutor) {
      sql += ` where tutee_id = ${userID}`;
    }
    sql += ` limit ${offset}, ${limit}`;
    this.db
      .load(sql)
      .then((data: any) => {
        if (!data) {
          return callback(new Error("Get list contract is in correct"));
        }
        if (data.lenght < 0) {
          return callback(new Error("List contract is empty"));
        }
        return callback(null, data);
      })
      .catch((err: Error) => {
        console.log("[ContractDB][getListContract][err]", err);
        return callback(new Error("Get list contract is incorrect"));
      });
  }

  getContractByOrderID(orderID: number, callback: Function) {
    var sql = `select * from ${this.tableName} where order_id = ${orderID}`;
    this.db
      .load(sql)
      .then((data: any) => {
        if (!data || data.lenght < 0) {
          return callback(new Error("Contract is empty"));
        }
        return callback(null, data);
      })
      .catch((err: Error) => {
        console.log("[ContractDB][getContractByOrderID][err]", err);
        return callback(new Error("Get contract failed"));
      });
  }
}

function isValidRole(role: number) {
  return !(role != Role.Tutee && role != Role.Tutor);
}
