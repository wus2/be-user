import { Router, NextFunction, Request, Response } from "express";
import Authenticate from "../plugins/middlewares/authen";
import {
  NotificationDB,
  NotificationModel,
  NotificationStatus
} from "../plugins/database/notification/notification";

const Pagination = 12;

/**
 * / route
 *
 * @class User
 */
export class NotifyRoute {
  constructor() {}
  /**
   * Create the routes.
   *
   * @class UserRoute
   * @method create
   * @static
   */
  public create(router: Router) {
    router.get(
      "/:notiID",
      (req, res, next) => {
        Authenticate.forUser(req, res, next);
      },
      (req, res) => {
        var notiID = Number(req.params.notiID);
        if (notiID < 0) {
          return res.json({
            code: -1,
            message: "Notification ID is incorrect"
          });
        }
        new NotificationDB().getNotification(
          notiID,
          (err: Error, data: any) => {
            if (err) {
              return res.json({
                code: -1,
                message: err.toString()
              });
            }
            return res.status(200).json({
              code: 1,
              message: "OK",
              data: data[0]
            });
          }
        );
      }
    );

    router.get(
      "/list/page/:page/limit/:limit",
      (req, res, next) => {
        Authenticate.forUser(req, res, next);
      },
      (req, res) => {
        var page = Number(req.params.page);
        var limit = Number(req.params.limit);
        if (page <= 0 || limit <= 0) {
          res.json({
            code: -1,
            message: "Page or limit is incorrect"
          });
        }
        var offset = (page - 1) * Pagination;
        new NotificationDB().getListNotification(
          offset,
          limit,
          (err: Error, data: any) => {
            if (err) {
              return res.json({
                code: -1,
                message: err.toString()
              });
            }
            return res.status(200).json({
              code: 1,
              message: "OK",
              data
            });
          }
        );
      }
    );

    router.post(
      "/add",
      (req, res, next) => {
        Authenticate.forUser(req, res, next);
      },
      (req, res) => {
        var desc = req.body.description;
        if (!desc) {
          return res.json({
            code: -1,
            message: "Description is empty"
          });
        }
        var entity = {
          description: desc,
          create_time: ~~(Date.now() / 1000),
          status: NotificationStatus.NotSeen
        } as NotificationModel;
        new NotificationDB().setNotification(
          entity,
          (err: Error, data: any) => {
            if (err) {
              return res.json({
                code: -1,
                message: err.toString()
              });
            }
            return res.status(200).json({
              code: 1,
              message: "OK"
            });
          }
        );
      }
    );

    router.post(
      "/seen/:notiID",
      (req, res, next) => {
        Authenticate.forUser(req, res, next);
      },
      (req, res) => {
        var notiID = Number(req.params.notiID);
        if (notiID < 0) {
          return res.json({
            code: -1,
            message: "Notification ID is incorrect"
          });
        }
        new NotificationDB().setSeen(notiID, (err: Error, data: any) => {
          if (err) {
            return res.json({
              code: -1,
              message: err.toString()
            });
          }
          return res.status(200).json({
            code: -1,
            message: "OK"
          });
        });
      }
    );
  }
}
