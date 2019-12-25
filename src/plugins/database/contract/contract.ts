import mysql, { IMysql } from "../mysql";
import { Role } from "../user/user";

export enum ContractStatus {
  Draft = 0,
  Pending = 1,
  Approved = 2,
  Created = 3,
  Finished = 4,
  Closed = 5,
  Reject = 6,
  Expired = 7
}

export interface ContractModel {
  cid?: number;
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
  getContractViaRole(conID: number, role: number, callback: Function): void;
  updateContract(contract: ContractModel, callback: Function): void;
  getListContract(
    userID: number,
    role: number,
    offset: number,
    limit: number,
    callback: Function
  ): void;
  getListContractWithUserInfo(
    userID: number,
    role: number,
    offset: number,
    limit: number,
    callback: Function
  ): void;
  getContractByOrderID(orderID: number, callback: Function): void;
  getListUserContract(offset: number, limit: number, callback: Function): void;
  getRateResultInContract(
    tutorID: number,
    offset: number,
    limit: number,
    callback: Function
  ): void;
  reveneuForTutor(
    tutorID: number,
    start: number,
    end: number,
    callback: Function
  ): void;
  revenueForSystem(start: number, end: number, callback: Function): void;
  revenueForTopTutor(start: number, end: number, callback: Function): void;
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
      .get(this.tableName, "cid", conID)
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

  getContractViaRole(conID: number, role: number, callback: Function) {
    var sql = "";
    if (role == Role.Tutee) {
      sql = `SELECT * FROM contract AS C JOIN user AS U ON C.tutor_id = U.id WHERE C.cid = ${conID}`;
    } else if (role == Role.Tutor) {
      sql = `SELECT * FROM contract AS C JOIN user AS U ON C.tutee_id = U.id WHERE C.cid = ${conID}`;
    }
    console.log(sql);
    this.db
      .load(sql)
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
      .update(this.tableName, "cid", contract)
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
    console.log(role);
    var sql = `select * from ${this.tableName}`;
    if (role == Role.Tutor) {
      sql += ` where tutor_id = ${userID}`;
    } else if (role == Role.Tutee) {
      sql += ` where tutee_id = ${userID}`;
    }
    sql += ` limit ${offset}, ${limit}`;

    console.log(sql);
    this.db
      .load(sql)
      .then((data: any) => {
        if (!data) {
          return callback(new Error("Get list contract is in correct"));
        }
        if (data.length < 0) {
          return callback(new Error("List contract is empty"));
        }
        return callback(null, data);
      })
      .catch((err: Error) => {
        console.log("[ContractDB][getListContract][err]", err);
        return callback(new Error("Get list contract is incorrect"));
      });
  }

  getListContractWithUserInfo(
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
    var sql = "";
    if (role == Role.Tutee) {
      sql = `SELECT * FROM contract AS C JOIN user AS U ON C.tutor_id = U.id`;
    } else if (role == Role.Tutor) {
      sql = `SELECT * FROM contract AS C JOIN user AS U ON C.tutee_id = U.id`;
    }
    if (role == Role.Tutor) {
      sql += ` where tutor_id = ${userID}`;
    } else if (role == Role.Tutee) {
      sql += ` where tutee_id = ${userID}`;
    }
    sql += ` limit ${offset}, ${limit}`;

    console.log(sql);
    this.db
      .load(sql)
      .then((data: any) => {
        if (!data) {
          return callback(new Error("Get list contract is in correct"));
        }
        if (data.length < 0) {
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
        if (!data || data.length < 0) {
          return callback(new Error("Contract is empty"));
        }
        return callback(null, data);
      })
      .catch((err: Error) => {
        console.log("[ContractDB][getContractByOrderID][err]", err);
        return callback(new Error("Get contract failed"));
      });
  }

  getListUserContract(offset: number, limit: number, callback: Function) {
    var sql = `select * from ${this.tableName} limit ${offset}, ${limit}`;
    this.db
      .load(sql)
      .then((data: any) => {
        if (!data || data.length < 0) {
          return callback(new Error("Contract list is empty"));
        }
        return callback(null, data);
      })
      .catch((err: Error) => {
        console.log("[ContractDB][getContractByOrderID][err]", err);
        return callback(new Error("Get list contract failed"));
      });
  }

  getRateResultInContract(
    tutorID: number,
    offset: number,
    limit: number,
    callback: Function
  ) {
    var sql = `SELECT U.name, C.stars, C.comment FROM contract AS C JOIN user AS U ON C.tutee_id = U.id WHERE tutor_id = ${tutorID} AND C.stars IS NOT NULL AND C.comment IS NOT NULL LIMIT ${offset}, ${limit}`;
    this.db
      .load(sql)
      .then((data: any) => {
        if (data && data.length > 0) {
          return callback(null, data);
        }
        return callback(new Error("List rate results is empty"));
      })
      .catch((err: Error) => {
        console.log("[ContractDB][getRateResultInContract][err]", err);
        return callback(new Error("List rate results is empty"));
      });
  }

  reveneuForTutor(
    tutorID: number,
    start: number,
    end: number,
    callback: Function
  ) {
    var sql = `SELECT order_create_date as create_time, order_amount as amount FROM contract WHERE status=${ContractStatus.Finished} AND tutor_id = ${tutorID} AND order_create_date >= ${start} AND order_create_date <= ${end}`;
    this.db
      .load(sql)
      .then((data: any) => {
        if (data && data.length > 0) {
          return callback(null, data);
        }
        return callback(new Error("Data is empty"));
      })
      .catch((err: Error) => {
        console.log("[ContractDB][getRateResultInContract][err]", err);
        return callback(new Error("Get data error"));
      });
  }

  revenueForSystem(start: number, end: number, callback: Function) {
    var sql = `SELECT SUM(order_amount)*0.25 as money from contract where status=${ContractStatus.Finished} and create_time>=${start} and create_time<=${end}`;
    this.db
      .load(sql)
      .then((data: any) => {
        if (data && data.length > 0) {
          return callback(null, data);
        }
        return callback(new Error("Data is empty"));
      })
      .catch((err: Error) => {
        console.log("[ContractDB][getRateResultInContract][err]", err);
        return callback(new Error("Get data error"));
      });
  }

  revenueForTopTutor(start: number, end: number, callback: Function) {
    var sql = `select c.tutor_id, u.name, SUM(order_amount) as money from contract as c join user as u on c.tutor_id = u.id where status=${ContractStatus.Finished} and create_time>=${start} and create_time<=${end} GROUP by c.tutor_id ORDER by money desc LIMIT 5`;
    this.db
      .load(sql)
      .then((data: any) => {
        if (data && data.length > 0) {
          return callback(null, data);
        }
        return callback(new Error("Data is empty"));
      })
      .catch((err: Error) => {
        console.log("[ContractDB][getRateResultInContract][err]", err);
        return callback(new Error("Get data error"));
      });
  }
}

function isValidRole(role: number) {
  return !(role != Role.Tutee && role != Role.Tutor);
}
