import mysql, { IMysql } from "../mysql";

export enum Status {
  Draft = 0,
  Pending = 1,
  Approved = 2,
  Closed = 3,
  Expired = 4
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
  contract_status?: number;
}

export interface IContractDB {
  db: IMysql;
  tableName: string;
  setContract(Contract: ContractModel, callback: Function): void;
  getContract(conID: number, callback: Function): void;
  updateContract(contract: ContractModel, callback: Function): void;
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
}
