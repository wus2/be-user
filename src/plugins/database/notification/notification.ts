import mysql from "../mysql";
import { IORM } from "../orm";

export enum NotificationStatus {
  NotSeen = 1,
  Seen = 2
}

export interface NotificationModel {
  id?: number;
  user_id?: number;
  from_name?: string;
  contract_id?: number;
  description?: string;
  create_time?: number;
  status?: number;
}

export interface INotificationDB {
  setNotification(notification: NotificationModel, callback: Function): void;
  getNotification(notiID: number, callback: Function): void;
  getListNotification(
    userID: number,
    offset: number,
    limit: number,
    callback: Function
  ): void;
  setSeen(notiID: number, callback: Function): void;
}

export class NotificationDB implements INotificationDB {
  db: IORM;
  tableName: string;
  constructor() {
    this.db = mysql;
    this.tableName = "notification";
  }

  setNotification(notification: NotificationModel, callback: Function) {
    this.db
      .add(this.tableName, notification)
      .then((data: any) => {
        if (data) {
          return callback(null, data);
        }
        return callback(new Error("Set database failed"));
      })
      .catch((err: Error) => {
        console.log("[NotificationDB][setNotification][err]", err);
        return callback(new Error("Set database failed"));
      });
  }

  getNotification(notiID: number, callback: Function) {
    this.db
      .get(this.tableName, "id", notiID)
      .then((data: any) => {
        if (data.length > 0) {
          return callback(null, data);
        }
        return callback(new Error("Notification empty"));
      })
      .catch((err: Error) => {
        console.log("[NotificationDB][getNotification][err]", err);
        return callback(new Error("Notification empty"));
      });
  }

  getListNotification(
    userID: number,
    offset: number,
    limit: number,
    callback: Function
  ) {
    var sql = `select * from ${this.tableName} where user_id = ${userID} limit ${offset}, ${limit}`;
    this.db
      .load(sql)
      .then((data: any) => {
        if (data.length > 0) {
          return callback(null, data);
        }
        return callback(new Error("Notification empty"));
      })
      .catch((err: Error) => {
        console.log("[NotificationDB][getListNotification][err]", err);
        return callback(new Error("Notification empty"));
      });
  }

  setSeen(notiID: number, callback: Function) {
    var entity = {
      id: notiID,
      status: NotificationStatus.Seen
    } as NotificationModel;
    this.db
      .update(this.tableName, "id", entity)
      .then((data: any) => {
        if (data > 0) {
          return callback(null, data);
        }
        return callback(new Error("Update failed"));
      })
      .catch((err: Error) => {
        console.log("[NotificationDB][setSeen][err]", err);
        return callback(new Error("Update failed"));
      });
  }
}
