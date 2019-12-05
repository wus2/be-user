var mysql = require("mysql");
var config = require("config");

var createConn = () => {
  return mysql.createConnection(config.get("dev-mysql"));
};

var conn;

function connect() {
  conn = createConn();
  conn.connect(err => {
    if (err) {
      console.log("[mysql]Error when connecting to mysql", err);
      setTimeout(connect, 2000);
    }
  });
  // If you're also serving http, display a 503 error.
  conn.on("error", err => {
    console.log("[mysq]Db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      connect();
    } else {
      throw err;
    }
  });
}

connect();

// release connection
process.on("exit", () => {
  console.log("shutdown mysql connection");
  conn.end();
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
        connection.release();
      })
    });
  },
  execute: sql => {
    return new Promise((resolve, reject) => {
      conn.query(sql, (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve({ results, fields });
        }
      });
    });
  },
  add: (tableName, entity) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  },
  addMultiple: (tableName, entities, fields) => {
    return new Promise((resolve, reject) => {
      var sql = `insert into ${tableName} (${fields}) values ?`
      conn.query(sql, [entities], (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
        var sql = `insert into ${tableName} set ?`;
        conn.query(sql, entity, (err, value) => {
          if (err) {
            reject(err);
          } else {
            resolve(err);
          }
        });
        connection.release();
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
        connection.release();
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
        connection.release();
      });
    });
  }
};
