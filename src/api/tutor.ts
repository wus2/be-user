import { Router, NextFunction, Request, Response } from "express";

import Authenticate from "../plugins/middlewares/authen";
import { ITutorHandler, TutorHandler } from "../handler/tutor/tutor";

/**
 * / route
 *
 * @class User
 */
export class TutorRoute {
  handler: ITutorHandler;
  constructor() {
    this.handler = new TutorHandler();
  }
  /**
   * Create the routes.
   *
   * @class UserRoute
   * @method create
   * @static
   */
  public create(router: Router) {
    router.put(
      "/updateskills",
      (req, res, next) => {
        Authenticate.forTutor(req, res, next);
      },
      (req, res) => {
        this.handler.updateSkills(req, res);
      }
    );

    router.get("/getlist/page/:page/limit/:limit", (req, res) => {
      this.handler.getListTutors(req, res);
    });

    router.put(
      "/updateintro",
      (req, res, next) => {
        Authenticate.forTutor(req, res, next);
      },
      (req, res) => {
        this.handler.updateIntro(req, res);
      }
    );

    router.get("/getprofile/:tutorID", (req, res) => {
      this.handler.getProfile(req, res);
    });

    router.get(
      "/getallskills",
      (req, res, next) => {
        Authenticate.forTutor(req, res, next);
      },
      (req, res) => {
        this.handler.getAllSkill(req, res);
      }
    );

    router.get("/filtertutor", (req, res) => {
      console.log(req.query);
      this.handler.filterTutor(req, res);
    });

    router.get(
      "/contract/:contractID",
      (req, res, next) => {
        Authenticate.forTutor(req, res, next);
      },
      (req, res) => {
        this.handler.getDetailContract(req, res);
      }
    );

    router.get(
      "/contracthistory/page/:page/limit/:limit",
      (req, res, next) => {
        Authenticate.forTutor(req, res, next);
      },
      (req, res) => {
        this.handler.getListContracttHistory(req, res);
      }
    );

    router.post(
      "/approvecontract/:contractID",
      (req, res, next) => {
        Authenticate.forTutor(req, res, next);
      },
      (req, res) => {
        this.handler.approveContract(req, res);
      }
    );
  }
}
