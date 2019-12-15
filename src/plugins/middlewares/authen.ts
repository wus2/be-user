import { Request, Response, NextFunction } from "express";

import passport from "passport";

const Role_User = 0;
const Role_Tutor = 1;
const Role_Tutee = 2;
const Role_Admin = 2110;

export default class Authenticate {
  public static forUser(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("jwt", { session: false }, payload => {
      if (!payload) {
        return res.json({
          code: -1,
          message: "Unauthenticated!"
        });
      }
      res.locals.payload = payload;
      next();
    })(req, res, next);
  }
  public static forTutor(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("jwt", { session: false }, payload => {
      if (!payload || payload.role != Role_Tutor) {
        return res.json({
          code: -1,
          message: "Unauthenticated!"
        });
      }
      res.locals.payload = payload;
      next();
    })(req, res, next);
  }
  public static forTutee(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("jwt", { session: false }, payload => {
      if (!payload || payload.role != Role_Tutee) {
        return res.json({
          code: -1,
          message: "Unauthenticated!"
        });
      }
      res.locals.payload = payload;
      next();
    })(req, res, next);
  }
  public static forAdmin(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("jwt", { session: false }, payload => {
      if (!payload || payload.role != Role_Admin) {
        return res.json({
          code: -1,
          message: "Unauthenticated!"
        });
      }
      res.locals.payload = payload;
      next();
    })(req, res, next);
  }
}
