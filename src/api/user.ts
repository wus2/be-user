import { Router, NextFunction, Request, Response } from "express";
import { IUserHandler, UserHandler } from "../handler/user/user";
import passport from "passport";

import Authenticate from "../plugins/middlewares/authen";
import UploadImage from "../plugins/middlewares/upload";

/**
 * / route
 *
 * @class User
 */
export class UserRoute {
  handler: IUserHandler;
  constructor() {
    this.handler = new UserHandler();
  }
  /**
   * Create the routes.
   *
   * @class UserRoute
   * @method create
   * @static
   */
  public create(router: Router) {
    router.post("/login", (req: Request, res: Response, next: NextFunction) => {
      this.handler.login(req, res, next);
    });

    router.get(
      "/auth/facebook",
      passport.authenticate("facebook", { scope: "email" })
    );

    router.get("/auth/facebook/callback", (req, res, next) => {
      this.handler.loginViaFB(req, res);
    });

    router.get(
      "/auth/google",
      passport.authenticate("google", { scope: "email" })
    );

    router.get("/auth/google/callback", (req, res, next) => {
      this.handler.loginViaGG(req, res);
    });

    router.post("/register", (req, res) => {
      this.handler.register(req, res);
    });

    router.get(
      "/profile",
      (req, res, next) => {
        Authenticate.forUser(req, res, next);
      },
      (req, res) => {
        this.handler.getProfile(req, res);
      }
    );

    router.post(
      "/updateprofile",
      (req, res, next) => {
        Authenticate.forUser(req, res, next);
      },
      (req, res) => {
        this.handler.updateProfile(req, res);
      }
    );

    router.post(
      "/updatepassword",
      (req, res, next) => {
        Authenticate.forUser(req, res, next);
      },
      (req, res) => {
        this.handler.updatePassword(req, res);
      }
    );

    router.post("/forgotpassword", (req, res) => {
      this.handler.forgotPassword(req, res);
    });

    router.post(
      "/updateavatar",
      (req, res, next) => {
        Authenticate.forUser(req, res, next);
      },
      (req, res, next) => {
        UploadImage(req, res, next);
      },
      (req, res) => {
        // sleep to ensure filename is forwarded
        setTimeout(() => {
          this.handler.updateAvatar(req, res);
        }, 500);
      }
    );

    router.post("/isexists/:username", (req, res) => {});

    router.post(
      "/validpassword",
      (req, res, next) => {
        Authenticate.forUser(req, res, next);
      },
      (req, res) => {}
    );

    router.get("/activeaccount/:username", (req, res) => {
      this.handler.activateAccount(req, res);
    });

    router.get("/confirmchange/:id", (req, res) => {
      this.handler.confirmChange(req, res);
    });

    router.get("/reclaimpassword/:secret", (req, res) => {
      this.handler.reclaimPassword(req, res);
    });
  }
}
