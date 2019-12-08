var mysql = require("../../plugins/database/mysql");

const table = "user";

class Tutor {
  constructor() {
    this.db = mysql;
  }

  /**
   *
   * @param {int} offset
   * @param {int} limit
   */
  getList(offset, limit, callback) {
    if (offset < 0 || limit < 0) {
      callback(new Error("Offset or limit is incorrect"));
    }

    var sql = `select * from ${table} where role = 1 limit ${offset}, ${limit}`;
    this.db
      .load(sql)
      .then(data => {
        callback(null, data);
      })
      .catch(err => {
        console.log("[Tutor][getList][err]", err);
        callback(new Error("Get database failed"));
      });
  }

  /**
   *
   * @param {int} uid
   * @param {string} desc
   * @param {function} callback
   */
  updateIntro(uid, desc, callback) {
    if (!desc) {
      callback(new Error("Empty desciption"));
    }
    var entity = {
      id: uid,
      intro_desc: desc
    };
    this.db
      .update(table, "id", entity)
      .then(data => {
        callback(null, data);
      })
      .catch(err => {
        console.log("[Tutor][updateIntro][err]", err);
        callback(new Error("Update database failed"));
      });
  }

  /**
   *
   * @param {int} id
   * @param {function} callback
   */
  getProfile(id, callback) {
    if (!id) {
      callback(new Error("Empty tutorID"));
    }
    var sql = `select * from ${table} where id = ${id}`;
    this.db
      .load(sql)
      .then(data => {
        if (data.role != 1) {
          callback(new Error("This ID is not a tutor"));
        }
        callback(null, data);
      })
      .catch(err => {
        console.log("[Tutor][getProfile][err]", err);
        callback(new Error("Get failed"));
      });
  }
}

module.exports = Tutor;
