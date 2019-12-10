var mysql = require("../../plugins/database/mysql");

var userTable = "user";

class ManageUser {
  constructor() {
    this.db = mysql;
  }

  getListUser(offset, limit, callback) {
    if (offset < 0 || limit < 0) {
      return callback(new Error("Offset or limit is incorrect"));
    }
    var sql = `select * from ${userTable} limit ${offset}, ${limit}`;
    this.db
      .load(sql)
      .then(data => {
        return callback(null, data);
      })
      .catch(err => {
        console.log("[ManageUser][getListUser][err]", err);
        return callback(new Error("Get list user failed"));
      });
  }

  getUserProfile(userID, callback) {
    if (!userID) {
      return callback(new Error("Empty userID"));
    }
    var sql = `select * from ${userTable} where id = ${userID}`;
    this.db
      .load(sql)
      .then(data => {
        return callback(null, data);
      })
      .catch(err => {
        console.log("[ManageUser][getUserProfile][err]", err);
        return callback(new Error("get user profile failed"));
      });
  }
}

module.exports = ManageUser;
