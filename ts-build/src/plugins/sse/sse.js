"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SSE = /** @class */ (function () {
    function SSE() {
    }
    SSE.SendMessage = function (id, data) {
        var client = this.clients.get(id);
        if (!client) {
            return "Client is not connect";
        }
        var dataStr = JSON.stringify(data);
        var ok = client.res.write(dataStr + "\n");
        if (!ok) {
            return "Send failed";
        }
        return "Send success";
    };
    SSE.EventsHandler = function (req, res, next) {
        var headers = {
            "Content-Type": "text/event-stream",
            Connection: "keep-alive",
            "Cache-Control": "no-cache"
        };
        res.writeHead(200, headers);
        var id = req.params.username;
        if (!id) {
            return;
        }
        var client = {
            res: res
        };
        this.clients.set(id, client);
        var data = "Connected\n";
        res.write(data);
        req.on("close", function () {
            console.log("Connection closed");
        });
    };
    SSE.clients = new Map();
    return SSE;
}());
exports.SSE = SSE;
