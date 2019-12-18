import mysql, { IMysql } from "../mysql";
import { loadavg } from "os";

export interface MessageModel {
  id?: number;
  room?: string;
  sender_id?: number;
  sender_name?: string;
  receiver_id?: number;
  receiver_name?: string;
  message?: string;
  send_time?: number;
}

export interface IMessageDB {
  setMessage(entity: MessageModel, callback: Function): void;
  getMessageHistory(
    room: string,
    offset: number,
    limit: number,
    callback: Function
  ): void;
  getRoom(senderID: string, receiverID: string, callback: Function): string;
  checkRoomExists(senderID: string, receiverID: string): boolean;
  generateRoom(senderID: string, receiverID: string): string;
}

export class MessageDB implements IMessageDB {
  db: IMysql;
  tableName: string;
  constructor() {
    this.db = mysql;
    this.tableName = "message";
  }

  setMessage(entity: MessageModel, callback: Function) {
    this.db
      .add(this.tableName, entity)
      .then((data: any) => {
        if (data) {
          return callback(null, data);
        }
        return callback(new Error("Set message failed"));
      })
      .catch(err => {
        console.log("[MessageDB][setMessage][err]", err);
        return callback(new Error("Set message failed"));
      });
  }

  getMessageHistory(
    room: string,
    offset: number,
    limit: number,
    callback: Function
  ) {
    if (!room) {
      return callback(new Error("Room is empty"));
    }
    if (offset < 0 || limit < 0) {
      return callback(new Error("Offset or limit is incorrect"));
    }
    var sql = `SELECT sender_id, sender_name, receiver_id, receiver_name, message FROM ${this.tableName} limit ${offset}, ${limit}`;
    this.db
      .load(sql)
      .then((data: any) => {
        if (!data) {
          return callback(new Error("Get message history failed"));
        }
        if (data.length < 0) {
          return callback(new Error("Get message history failed"));
        }
        callback(null, data);
      })
      .catch((err: Error) => {
        console.log("[MessageDB][getMessageHistory][err]", err);
        return callback(new Error("Get message history failed"));
      });
  }

  getRoom(senderID: string, receiverID: string, callback: Function) {
    if (!senderID || !receiverID) {
      return callback(new Error("SenderID or receiverID is incorrect"));
    }
    var room = senderID + receiverID;
    var sql = `select * from ${this.tableName} where room = ${room}`;
    this.db
      .load(sql)
      .then((data: any) => {
        if (data[0]) {
          return callback(null, "");
        }
        return callback(new Error("Room is not exists"));
      })
      .catch((err: Error) => {
        console.log("[MessageDB][getRoom][err]", err);
        return callback(new Error("Get database is failed"));
      });

    return "";
  }

  checkRoomExists(senderID: string, receiverID: string) {
    return true;
  }

  generateRoom(senderID: string, receiverID: string) {
    return "";
  }
}
