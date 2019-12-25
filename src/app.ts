import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride from "method-override";
import cors from "cors";
var sslRedirect = require("heroku-ssl-redirect");

import { UserRoute } from "./api/user";
import { AdminRoute } from "./api/admin";
import { TutorRoute } from "./api/tutor";
import { TuteeRoute } from "./api/tutee";
import { SSE } from "./plugins/sse/sse";
import { NotifyRoute } from "./api/notify";
import { PaymentRoute } from "./api/payment";

/**
 * The server.
 *
 * @class Server
 */
export class Server {
  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    this.app = express();
    this.config();
    this.api();
  }

  public Run(port: number) {
    this.app.listen(port, () => {
      console.log("[RunServer] server is runing on port", port);
    });
  }

  /**
   * Create REST API routes
   *
   * @class Server
   * @method api
   */
  public api() {
    let userRouter = express.Router();
    new UserRoute().create(userRouter);
    let adminRouter = express.Router();
    new AdminRoute().create(adminRouter);
    let tutorRoute = express.Router();
    new TutorRoute().create(tutorRoute);
    let tuteeRoute = express.Router();
    new TuteeRoute().create(tuteeRoute);
    let notiRoute = express.Router();
    new NotifyRoute().create(notiRoute);
    let paymentRoute = express.Router();
    new PaymentRoute().create(paymentRoute);

    this.app.use("/user", userRouter);
    this.app.use("/admin", adminRouter);
    this.app.use("/tutor", tutorRoute);
    this.app.use("/tutee", tuteeRoute);
    this.app.use("/noti", notiRoute);
    this.app.use("/order", paymentRoute);

    this.app.use("/event/:username", (req, res, next) => {
      SSE.EventsHandler(req, res, next);
    });
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    this.app.use(express.static(path.join(__dirname, "public")));
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "jade");
    this.app.use(logger("dev"));
    this.app.use(bodyParser.json());
    this.app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    this.app.use(express.urlencoded());
    this.app.use(cookieParser("SECRET_GOES_HERE"));
    this.app.use(methodOverride());
    this.app.use(cors());
    this.app.use(sslRedirect());
    require("./plugins/middlewares/passport");

    //catch 404 and forward to error handler
    this.app.use(function(
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) {
      err.status = 404;
      next(err);
    });
    this.app.use(errorHandler());
  }
}
