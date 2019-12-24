import { Router, NextFunction, Request, Response } from "express";
import Authenticate from "../plugins/middlewares/authen";
import {
  NotificationDB,
  NotificationModel,
  NotificationStatus
} from "../plugins/database/notification/notification";

const Pagination = 12;

export class NotifyRoute {
  constructor() {}

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
        var payload = res.locals.payload;
        if (!payload) {
          return res.json({
            code: -1,
            message: "User payload is empty"
          });
        }
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
          payload.id,
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
        var userID = Number(req.body.userID);
        if (userID < 0) {
          return res.json({
            code: -1,
            message: "User ID is empty"
          });
        }
        var desc = req.body.description;
        if (!desc) {
          return res.json({
            code: -1,
            message: "Description is empty"
          });
        }
        var entity = {
          user_id: userID,
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
