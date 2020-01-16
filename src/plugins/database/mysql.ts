import * as mysql from "mysql";
import { IORM } from "./orm";
import config from "config";

class Mysql implements IORM {
  pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool(config.get("mysql-server"));
  }

  load(sql: string): Promise<Function> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) {
          console.log("[mysql][load] err", err);
          return err;
        }
        conn.query(sql, (err, results, fields) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
        conn.release();
        // handle error after release
        if (err) {
          console.log("[mysql][load] err", err);
          return err;
        }
      });
    });
  }

  add(tableName: string, entity: any): Promise<Function> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) {
          console.log("[mysql][load] err", err);
          return err;
        }
        var sql = `insert into ${tableName} set ?`;
        conn.query(sql, entity, (err, value) => {
          if (err) {
            reject(err);
          } else {
            resolve(value);
          }
        });
        conn.release();
        // handle error after release
        if (err) {
          console.log("[mysql][load] err", err);
          return err;
        }
      });
    });
  }

  addMultiple(
    tableName: string,
    entities: Array<any>,
    fields: string
  ): Promise<Function> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) {
          console.log("[mysql][load] err", err);
          return err;
        }
        var sql = `insert into ${tableName} (${fields}) values ?`;
        conn.query(sql, [entities], (err, value) => {
          if (err) {
            reject(err);
          } else {
            resolve(value);
          }
          conn.release();
          // handle error after release
          if (err) {
            console.log("[mysql][load] err", err);
            return err;
          }
        });
      });
    });
  }

  get(tableName: string, idField: string, id: number): Promise<Function> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) {
          console.log("[mysql][load] err", err);
          return err;
        }
        var sql = `select * from ${tableName} where ${idField} = ${id}`;
        conn.query(sql, (err, results, fields) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
        conn.release();
        // handle error after release
        if (err) {
          console.log("[mysql][load] err", err);
          return err;
        }
      });
    });
  }

  update(tableName: string, idField: string, entity: any): Promise<Function> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) {
          console.log("[mysql][update] err", err);
          return err;
        }
        var id = entity[idField];
        delete entity[idField];

        var sql = `update ${tableName} set ? where ${idField} = ?`;
        conn.query(sql, [entity, id], (err, value) => {
          if (err) {
            reject(err);
          } else {
            resolve(value.changedRows);
          }
        });
        conn.release();
        // handle error after release
        if (err) {
          console.log("[mysql][load] err", err);
          return err;
        }
      });
    });
  }

  delete(tableName: string, idField: string, id: number): Promise<Function> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, conn) => {
        if (err) {
          console.log("[mysql][delete] err", err);
          return err;
        }
        var sql = `delete from ${tableName} where ${idField} = ?`;
        conn.query(sql, id, (err, value) => {
          if (err) {
            reject(err);
          } else {
            resolve(value.affectedRows);
          }
        });
        conn.release();
        // handle error after release
        if (err) {
          console.log("[mysql][load] err", err);
          return err;
        }
      });
    });
  }
}

const instance = new Mysql();

export default instance;
