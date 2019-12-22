"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * / route
 *
 * @class User
 */
var APIRoute = /** @class */ (function () {
    function APIRoute() {
    }
    /**
     * Create the routes.
     *
     * @class UserRoute
     * @method create
     * @static
     */
    APIRoute.prototype.create = function (router) {
        router.post("/tunnels", function (req, res) {
            console.log(req);
            return res.send("Tunnels");
        });
    };
    return APIRoute;
}());
exports.APIRoute = APIRoute;
