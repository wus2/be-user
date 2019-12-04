var mysql = require('mysql');
var config = require('config')

var createConn = () => {
  return mysql.createPool(config.get('dev-mysql'));
};

var pool = createConn();
pool.connect(err => {
  console.log(err.code); // 'ECONNREFUSED'
  console.log(err.fatal); // true
});

process.on('exit', () => {
  console.log('shutdown mysql connection');
  pool.end(err => {
    console.log("[mysql][end] err", err)
  });
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
  add: (tableName, entity) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) {
          console.log("[mysql][add] err", err)
          return err
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
