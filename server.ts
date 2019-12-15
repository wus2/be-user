import { Server } from "./src/app";

const Port = 55210;

function StartServer(port: number) {
  if (port < 0) {
    console.log("Port is incorrect!");
  } else {
    new Server().Run(port);
  }
}

StartServer(Port);
