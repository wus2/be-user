"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./src/app");
var Port = 55210;
function StartServer(port) {
    if (port < 0) {
        console.log("Port is incorrect!");
    }
    else {
        new app_1.Server().Run(port);
    }
}
StartServer(Port);
