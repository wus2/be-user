import { Request, Response, NextFunction } from "express";
import { UserHandler } from "./user";
import { UserModel } from "../../plugins/database/user/user";
import { json } from "body-parser";

export function ValidateUsername(
  this: UserHandler,
  req: Request,
  res: Response
) {
  var username = req.params.username;
  if (username.length <= 0) {
    return res.json({
      code: -1,
      message: "Empty username"
    });
  }
  this.userDB.validateUsername(username, (err: Error, ok: boolean) => {
    if (err) {
      return res.json({
        code: -1,
        message: err.toString()
      });
    }
    if (ok) {
      return res.json({
        code: -1,
        message: "Username existed",
        existed: true
      });
    }
    return res.status(200).json({
      code: 1,
      message: "OK",
      existed: false
    });
  });
}

export function ValidatePassword(
  this: UserHandler,
  req: Request,
  res: Response
) {
  var password = req.body.password;
  if (password.length <= 0) {
    return res.json({
      code: -1,
      message: "Username or password is incorrect"
    });
  }
  var payload = res.locals.payload;
  if (!payload) {
    return res.json({
      code: -1,
      message: "User payload is empty"
    });
  }
  this.userDB.getByID(payload.id, (err: Error, data: any) => {
    if (err) {
      return res.json({
        code: -1,
        message: err.toString()
      });
    }
    var user = data[0] as UserModel;
    if (!user.password) {
      return res.json({
        code: -1,
        message: "Data is not a user model"
      });
    }
    if (password !== user.password) {
      return res.json({
        code: -1,
        message: "Incorrect password"
      });
    }
    return res.status(200).json({
      code: 1,
      message: "OK"
    });
  });
}
