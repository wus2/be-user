import { Request, Response } from "express";
import { UserHandler } from "./user";
import { UserModel } from "../../plugins/database/user/user";

import config from "config";

const activePrefix = "active_account";
const confirmPrefix = "confirm_change";

export function ActivateAccount(
  this: UserHandler,
  req: Request,
  res: Response
) {
  var key = activePrefix + req.params.username;
  console.log("[activateAccount]", key);
  var value = this.cache.get(key);
  if (value == undefined) {
    return res.json({
      code: -1,
      message: "Active account expired"
    });
  }
  this.cache.delete(key);

  var model = value as UserModel;
  if (!model) {
    console.log("[ActivateAccount][err] cast to model error", value);
    return res.json({
      code: -1,
      message: "Register failed"
    });
  }
  this.userDB.setUser(model, (err: Error, data: any) => {
    if (err) {
      console.error("[ActivateAccount]", err);
      return res.json({
        code: -1,
        message: "Register failed"
      });
    }
    return res.redirect(config.get("redirect"));
  });
}

export function ConfirmChange(this: UserHandler, req: Request, res: Response) {
  var key = confirmPrefix + req.params.id;
  console.log("[confirmChange]", key);
  var value = this.cache.get(key);
  console.log(value);
  if (value == undefined) {
    return res.json({
      code: -1,
      message: "Confirm change expired"
    });
  }
  this.cache.delete(key);

  var model = value as UserModel;
  if (!model) {
    console.log("[ConfirmChange][err] cast to model error", value);
    return res.json({
      code: -1,
      message: "Update password failed"
    });
  }
  this.userDB.updateUser(model, (err: Error, data: any) => {
    if (err) {
      console.error("[ConfirmChange]", err);
      return res.json({
        code: -1,
        message: "Update password failed"
      });
    }
    return res.redirect(config.get("redirect"));
  });
}

export function ReclaimPassword(this: UserHandler, req: Request, res: Response) {
  
}