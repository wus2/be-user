var mysql = require("mysql");
var config = require("config");

var createPool = () => {
  return mysql.createPool(config.get("mysql-dev"));
};

var pool = createPool();

// release connection
process.on("exit", () => {
  console.log("shutdown mysql connection");
  pool.end();
});

module.exports = {
  load: sql => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) {
          console.log("[mysql][load] err", err)
          return err
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
          console.log("[mysql][load] err", err)
          return err
        }
      })
    });
  },
  execute: sql => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) {
          console.log("[mysql][load] err", err)
          return err
        }
        conn.query(sql, (err, results, fields) => {
          if (err) {
            reject(err);
          } else {
            resolve({ results, fields });
          }
        });
        conn.release();
        // handle error after release
        if (err) {
          console.log("[mysql][load] err", err)
          return err
        }
      })
    });
  },
  add: (tableName, entity) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) {
          console.log("[mysql][load] err", err)
          return err
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
          console.log("[mysql][load] err", err)
          return err
        }
      })
    });
  },
  addMultiple: (tableName, entities, fields) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) {
          console.log("[mysql][load] err", err)
          return err
        }
        var sql = `insert into ${tableName} (${fields}) values ?`
        conn.query(sql, [entities], (err, value) => {
          if (err) {
            reject(err);
          } else {
            resolve(value);
          }
          conn.release();
          // handle error after release
          if (err) {
            console.log("[mysql][load] err", err)
            return err
          }
        })
      })
    });
  },
  update: (tableName, idField, entity) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) {
          console.log("[mysql][update] err", err)
          return err
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
          console.log("[mysql][load] err", err)
          return err
        }
      })
    });
  },

  delete: (tableName, idField, id) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) {
          console.log("[mysql][delete] err", err)
          return err
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
          console.log("[mysql][load] err", err)
          return err
        }
      });
    });
  }
};