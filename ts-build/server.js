"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var app_1 = require("./src/app");
var socket_1 = require("./src/plugins/socket/socket");
var httpPort = 55210;
var app = app_1.Server.bootstrap().app;
app.set("port", httpPort);
var httpServer = http_1.default.createServer(app);
// start a socket server
new socket_1.SocketServer(httpServer).Start();
httpServer.listen(httpPort);
httpServer.on("error", function () {
    console.log("Something wrong");
});
httpServer.on("listening", function () {
    console.log("Server is listening on port: ", httpPort);
});
