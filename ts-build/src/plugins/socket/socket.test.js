"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var app_1 = require("../../app");
var socket_1 = require("./socket");
var httpPort = 55210;
var app = app_1.Server.bootstrap().app;
app.set("port", httpPort);
var httpServer = http_1.default.createServer(app);
socket_1.SocketServer.Init(httpServer).Start();
var socketServer = socket_1.SocketServer.Instance();
console.log(socketServer);
