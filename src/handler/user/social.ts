// var passport = require("passport");
// var jwt = require("jsonwebtoken");
// var config = require("config");

// var models = require("../../plugins/database/users");

import { Request, Response } from "express";
import passport from "passport";
import jwt, { Secret } from "jsonwebtoken";
import config from "config";
import { UserHandler } from "./user";
import { UserModel } from "../../plugins/database/user/user";

const usernameFBPrefix = "facebook_";

export function LoginViaFB(this: UserHandler, req: Request, res: Response) {
  passport.authenticate(
    "facebook",
    {
      session: false
    },
    (err, user, info) => {
      if (err) {
        return res.json({
          code: err.code,
          message: err.toString().message
        });
      }
      if (!user) {
        return res.json({
          code: -1,
          message: "Emty user data!"
        });
      }

      this.userDB.getByUsername(
        usernameFBPrefix + user.id,
        (err: Error, data: any) => {
          if (err) {
            var entity = {
              username: usernameFBPrefix + user.id,
              email: user.emails,
              name: user.displayName,
              gender: user.gender,
              role: 0
            } as UserModel;
            this.userDB.setUser(entity, (err: Error, data: any) => {
              if (err) {
                console.log("[passport][authenticate] err", err);
                return res.json({
                  code: -1,
                  message: "Login failed"
                });
              }
              login(req, res, data);
            });
          }
          login(req, res, data[0]);
        }
      );
    }
  )(req, res);
}

const usernameGGPrefix = "google_";

export function LoginViaGG(this: UserHandler, req: Request, res: Response) {
  passport.authenticate(
    "google",
    {
      session: false
    },
    (err, user, info) => {
      if (err) {
        return res.json({
          code: err.code,
          message: err.toString().message
        });
      }
      if (!user) {
        return res.json({
          code: -1,
          message: "Emty user data!"
        });
      }
      this.userDB.getByUsername(
        usernameGGPrefix + user.id,
        (err: Error, data: any) => {
          if (err) {
            var entity = {
              username: usernameGGPrefix + user.id,
              email: user.emails,
              name: user.displayName,
              gender: user.gender,
              role: 0
            } as UserModel;
            this.userDB.setUser(entity, (err: Error, data: any) => {
              if (err) {
                console.log("[passport][authenticate] err", err);
                return res.json({
                  code: -1,
                  message: "Login failed"
                });
              }
              login(req, res, data);
            });
          }
          login(req, res, data[0]);
        }
      );
    }
  )(req, res);
}

function login(req: Request, res: Response, data: any) {
  req.login(data, { session: false }, err => {
    if (err) {
      console.log("[login] err", err);
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
        avatar: data.avatar,
        name: data.name,
        role: data.role
      },
      token
    });
  });
}
