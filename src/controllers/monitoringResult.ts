import { Controller } from "./controller";
import { HttpServer } from "../server/httpServer";
import { Request, Response } from "restify";
import { monitoringResultsService } from "../services/monitoredResults";
import { getAuthorizedUserId } from "../auth";

export class MonitoringResultController implements Controller {
  public initialize(httpServer: HttpServer): void {
    httpServer.get("/results", this.list.bind(this));
    httpServer.get("/results/:id", this.list.bind(this));
  }

  private async list(req: Request, res: Response): Promise<void> {
    try {
      let user = await getAuthorizedUserId(req);
      res.send(await monitoringResultsService.list(user, req.params.id));
    } catch (e) {
      res.send(500, e.message);
    }
  }
}
