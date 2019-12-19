import { Request, Response, NextFunction } from "express";

export interface Client {
  topic: string[];
  res: Response;
}

export interface ISSE {}

export class SSE implements ISSE {
  static clients = new Map<string, Client>();
  constructor() {}

  public static SendMessage(id: string, data: any) {
    var client = this.clients.get(id);
    if (!client) {
      return "Client is not connect";
    }
    var dataStr = JSON.stringify(data)
    var ok = client.res.write(`${dataStr}\n`);
    if (!ok) {
      return "Send failed";
    }
    return "Send success";
  }

  public static EventsHandler(req: Request, res: Response, next: NextFunction) {
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache"
    };
    res.writeHead(200, headers);

    var id = req.params.username;
    if ( !id) {
      return;
    }
    var client = {
      res: res
    } as Client;
    this.clients.set(id, client);

    const data = `Connected\n`;
    res.write(data);

    req.on("close", () => {
      console.log(`Connection closed`);
    });
  }
}
