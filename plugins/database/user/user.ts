import mysql, { IMysql } from "../mysql";

export interface Model {
  id?: number;
}

export interface IUserDB {
  db: IMysql;
}

export default class UserDB implements IUserDB {
  db: IMysql;
  constructor() {
    this.db = mysql;
  }
}
