import { Controller } from "./controller";
import { HttpServer } from "../server/httpServer";
import { Request, Response } from "restify";
import { monitoredEndpointsService } from "../services/monitoredEndpoints";
import { getAuthorizedUserId } from "../auth";

export class MonitoredEndpointsController implements Controller {
  public initialize(httpServer: HttpServer): void {
    httpServer.get("endpoints", this.list.bind(this));
    httpServer.get("endpoints/:id", this.getById.bind(this));
    httpServer.post("endpoints", this.create.bind(this));
    httpServer.put("endpoints/:id", this.update.bind(this));
    httpServer.del("endpoints/:id", this.remove.bind(this));
  }

  private async list(req: Request, res: Response): Promise<void> {
    try {
      let user = await getAuthorizedUserId(req);
      res.send(await monitoredEndpointsService.list(user));
    } catch (e) {
      res.send(500, e.message);
    }
  }

  private async getById(req: Request, res: Response): Promise<void> {
    try {
      let user = await getAuthorizedUserId(req);
      const endpoint = await monitoredEndpointsService.getById(
        user,
        req.params.id
      );
      res.send(endpoint ? 200 : 404, endpoint);
    } catch (e) {
      res.send(500, e.message);
    }
  }

  private async create(req: Request, res: Response): Promise<void> {
    try {
      let user = await getAuthorizedUserId(req);
      const b = req.body;
      if (b.name && b.url && b.monitorInterval) {
        res.send(await monitoredEndpointsService.create(user, req.body));
      } else {
        res.send(400, "request body missing items");
      }
    } catch (e) {
      res.send(500, e.message);
    }
  }

  private async update(req: Request, res: Response): Promise<void> {
    try {
      let user = await getAuthorizedUserId(req);
      if (req.body.id) {
        res.send(await monitoredEndpointsService.update(user, req.body));
      } else {
        res.send(400, 'request body is missing element "id"');
      }
    } catch (e) {
      res.send(500, e.message);
    }
  }

  private async remove(req: Request, res: Response): Promise<void> {
    try {
      let user = await getAuthorizedUserId(req);
      await monitoredEndpointsService.delete(user, req.params.id);
      res.send(200);
    } catch (e) {
      res.send(500, e.message);
    }
  }
}
