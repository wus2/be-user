import { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt, { Secret } from "jsonwebtoken";
import config from "config";
import { UserHandler } from "./user";

export function Login(this: UserHandler, req: Request, res: Response, next: NextFunction) {
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
          id: user[0].id,
          username: user[0].username,
          role: user[0].role
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
            avatar: user[0].avatar,
            name: user[0].name,
            role: user[0].role
          },
          token
        });
      });
    }
  )(req, res, next);
}
