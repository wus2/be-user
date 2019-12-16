import { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt, { Secret } from "jsonwebtoken";
import config from "config";
import { UserHandler } from "./user";
import { UserModel, AccountStatus } from "../../plugins/database/user/user";

export function Login(
  this: UserHandler,
  req: Request,
  res: Response,
  next: NextFunction
) {
  passport.authenticate(
    "local",
    { session: false },
    (err: Error, user: any, info: any) => {
      if (err || !user) {
        return res.json({
          code: 400,
          message: info ? info.message : "Login failed"
        });
      }
      var data = user[0] as UserModel;
      if (!user) {
        return res.json({
          code: -1,
          message: "User is incorrect"
        });
      }
      if (data.account_status == AccountStatus.Block) {
        return res.json({
          code: -1,
          message: "Account is blocked"
        });
      }
      req.login(user, { session: false }, (err: Error) => {
        if (err) {
          console.log("[Login][err]", err);
          return res.json({
            code: -1,
            message: "Login failed"
          });
        }

        var key = config.get("key_jwt");
        const payload = {
          id: data.id,
          username: data.username,
          role: data.role
        };
        var token = jwt.sign(payload, key as Secret);
        if (!token) {
          return res.json({
            code: -1,
            message: "Can't sign token"
          });
        }
        return res.json({
          code: 1,
          message: "OK",
          user: {
            ...payload,
            avatar:data.avatar,
            name: data.name,
            role: data.role
          },
          token
        });
      });
    }
  )(req, res, next);
}
