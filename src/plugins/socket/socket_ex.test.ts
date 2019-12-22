import http from "http";
import { Server } from "../../app";
import { SocketServer } from "./socket_ex";

const httpPort = 55210;

var app = Server.bootstrap().app;
app.set("port", httpPort);
var httpServer = http.createServer(app);

SocketServer.Init(httpServer).Start();

var socketServer = SocketServer.Instance();
console.log(socketServer);
