import { Request, Response } from "express";
import { UserHandler } from "./user";

import { UserModel, AccountStatus } from "../../plugins/database/user/user";

export function Register(this: UserHandler, req: Request, res: Response) {
  var username = req.body.username;
  var entity = {
    username: username,
    password: req.body.password,
    email: req.body.email,
    address: req.body.address,
    district: req.body.district,
    name: req.body.name,
    phone: req.body.phone,
    dob: req.body.dob,
    card_id: req.body.cardID,
    gender: req.body.gender,
    avatar: req.body.avatar,
    role: req.body.role,
    account_status: AccountStatus.Active,
  } as UserModel;
  if (!entity) {
    return res.json({
      code: -1,
      message: "Body is incorrect"
    });
  }
  if (!entity.email) {
    console.log("Empty email");
    return res.json({
      code: -1,
      message: "Empty email"
    });
  }
  this.mailer.activateAccount(entity.email, username);
  var key = this.activePrefix + entity.username;
  var ok = this.cache.set(key, entity);
  if (!ok) {
    return res.json({
      code: -1,
      message: "System error"
    });
  }
  return res.json({
    code: 1,
    message: "OK"
  });
}
