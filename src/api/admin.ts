import { Router, NextFunction, Request, Response } from "express";

import Authenticate from "../plugins/middlewares/authen";
import { IAdminHandler, AdminHandler } from "../handler/admin/admin";

/**
 * / route
 *
 * @class User
 */
export class AdminRoute {
  handler: IAdminHandler;
  constructor() {
    this.handler = new AdminHandler();
  }
  /**
   * Create the routes.
   *
   * @class UserRoute
   * @method create
   * @static
   */
  public create(router: Router) {
    router.get(
      "/skills/page/:page/limit/:limit",
      (req, res, next) => {
        Authenticate.forAdmin(req, res, next);
      },
      (req, res) => {
        this.handler.getListSkill(req, res);
      }
    );

    router.get(
      "/getskill/:skillID",
      (req, res, next) => {
        Authenticate.forAdmin(req, res, next);
      },
      (req, res) => {
        this.handler.getSkill(req, res);
      }
    );

    router.post(
      "/addskill",
      (req, res, next) => {
        Authenticate.forAdmin(req, res, next);
      },
      (req, res) => {
        this.handler.addSkill(req, res);
      }
    );

    router.put(
      "/updateskill",
      (req, res, next) => {
        Authenticate.forAdmin(req, res, next);
      },
      (req, res) => {
        this.handler.updateSkill(req, res);
      }
    );

    router.delete(
      "/removeskill/:skillID",
      (req, res, next) => {
        Authenticate.forAdmin(req, res, next);
      },
      (req, res) => {
        this.handler.removeSkill(req, res);
      }
    );

    router.get(
      "/getusers/page/:page/limit/:limit",
      (req, res, next) => {
        Authenticate.forAdmin(req, res, next);
      },
      (req, res) => {
        this.handler.getListUser(req, res);
      }
    );

    router.get(
      "/user/:userID",
      (req, res, next) => {
        Authenticate.forAdmin(req, res, next);
      },
      (req, res) => {
        this.handler.getUserProfile(req, res);
      }
    );

    router.put(
      "/blockuser/:userID",
      (req, res, next) => {
        Authenticate.forAdmin(req, res, next);
      },
      (req, res) => {
        this.handler.lockUser(req, res);
      }
    );

    router.put(
      "/unblockuser/:userID",
      (req, res, next) => {
        Authenticate.forAdmin(req, res, next);
      },
      (req, res) => {
        this.handler.unlockUser(req, res);
      }
    );

    router.put(
      "/processcomplain/:complainID",
      (req, res, next) => {
        Authenticate.forAdmin(req, res, next);
      },
      (req, res) => {
        this.handler.processComplain(req, res);
      }
    );

    router.get(
      "/messagehistory",
      (req, res, next) => {
        Authenticate.forAdmin(req, res, next);
      },
      (req, res) => {
        this.handler.getUserMessageHistory(req, res);
      }
    );

    router.get(
      "/listcomplain/page/:page/limit/:limit",
      (req, res, next) => {
        Authenticate.forAdmin(req, res, next);
      },
      (req, res) => {
        this.handler.getListComplain(req, res);
      }
    );
  }
}
