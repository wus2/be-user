import mysql, { IMysql } from "../mysql";

export enum Role {
  User = 0,
  Tutor = 1,
  Tutee = 2,
  Admin = 3
}

export interface Model {
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  address?: string;
  district?: string;
  name?: string;
  phone?: string;
  dob?: string;
  card_id?: string;
  gender?: string;
  avatar?: string;
  role?: number;
}

export interface IUserDB {
  db: IMysql;
  tableName: string;
  setUser(user: Model, callback: Function): void;
  getByID(userID: number, callback: Function): void;
  getValidUser(username: string, password: string, callback: Function): void;
  getByUsername(username: string, callback: Function): void;
  getListUsers(offset: number, limit: number, callback: Function): void;
  updateUser(user: Model, callback: Function): void;
}

export default class UserDB implements IUserDB {
  db: IMysql;
  tableName: string;
  constructor() {
    this.db = mysql;
    this.tableName = "user";
  }

  setUser(user: Model, callback: Function) {
    this.db
      .add(this.tableName, user)
      .then((data: any) => {
        if (data) {
          return callback(null, data);
        }
        return callback(new Error("Set user failed"));
      })
      .catch((err: Error) => {
        console.log("[UserDB][setUser][err]", err);
        return callback(new Error("Set user failed"));
      });
  }

  getByID(userID: number, callback: Function) {
    var sql = `select * from user where id = ${userID}`;
    this.db
      .load(sql)
      .then((data: any) => {
        if (data) {
          return callback(null, data);
        }
        return callback(new Error("Get user failed"));
      })
      .catch((err: Error) => {
        console.log("[UserDB][getByID][err]", err);
        return callback(new Error("Get user failed"));
      });
  }

  getValidUser(username: string, password: string, callback: Function) {
    var sql = `select * from user where username = '${username}' and password = '${password}'`;
    this.db
      .load(sql)
      .then((data: any) => {
        if (data) {
          return callback(null, data);
        }
        return callback(new Error("User is invalid"));
      })
      .catch((err: Error) => {
        console.log("[UserDB][getValidUser][err]", err);
        return callback(new Error("Get valid user is failed"));
      });
  }

  getByUsername(username: string, callback: Function) {
    var sql = `select * from user where username = '${username}`;
    this.db
      .load(sql)
      .then((data: any) => {
        if (data) {
          return callback(null, data);
        }
        return callback(new Error("Get database failed"));
      })
      .catch((err: Error) => {
        console.log("[UserDB][getByUsername][err]", err);
        return callback(new Error("Get database failed"));
      });
  }

  getListUsers(offset: number, limit: number, callback: Function) {
    if (offset < 0 || limit < 0) {
      return callback(new Error("Offset or limit is incorrect"));
    }
    var sql = `select * from ${this.tableName} limit ${offset}, ${limit}`;
    this.db
      .load(sql)
      .then(data => {
        if (data) {
          return callback(null, data);
        }
        return callback(new Error("List user is empty"));
      })
      .catch(err => {
        console.log("[UserDB][getListUser][err]", err);
        return callback(new Error("Get list user failed"));
      });
  }

  updateUser(user: Model, callback: Function) {
    this.db
      .update(this.tableName, "id", user)
      .then((data: any) => {
        if (data) {
          return callback(null, data);
        }
        return callback(new Error("Update user failed"));
      })
      .catch((err: Error) => {
        console.log("[UserDB][updateUser][err]", err);
        return callback(new Error("Set user failed"));
      });
  }
}
