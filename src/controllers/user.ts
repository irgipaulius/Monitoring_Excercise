import { Controller } from "./controller";
import { HttpServer } from "../server/httpServer";
import { Request, Response } from "restify";
import { userService } from "../services/user";

export class UserController implements Controller {
  public initialize(httpServer: HttpServer): void {
    httpServer.get("user", this.list.bind(this));
  }

  //this is a cheaty debug feature - any user is able to see other user's auth tokens.
  private async list(req: Request, res: Response): Promise<void> {
    res.send(await userService.list());
  }
}
