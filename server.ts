import http from "http";
import { Server } from "./src/app";
import { SocketServer } from "./src/plugins/socket/socket";

const httpPort = 55210;

var app = Server.bootstrap().app;
app.set("port", httpPort);
var httpServer = http.createServer(app);

// start a socket server
new SocketServer(httpServer).Start();

httpServer.listen(httpPort);

httpServer.on("error", () => {
  console.log("Something wrong");
});

httpServer.on("listening", () => {
  console.log("Server is listening on port: ", httpPort);
});
