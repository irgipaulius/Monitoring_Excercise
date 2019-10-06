import {
  MonitoredResultsService,
  monitoringResultsService
} from "../services/monitoredResults";
import { MonitoredEndpoints } from "../models/monitoredEndpoints";
import request, { Response } from "request";
import { MonitoringResult } from "../models/monitoringResult";

export default class Monitor {
  task: NodeJS.Timeout;
  endpoint: MonitoredEndpoints;
  constructor(endpoint: MonitoredEndpoints, startMonitoring: boolean) {
    this.endpoint = endpoint;
    if (startMonitoring) {
      this.startMonitoringEndpoint();
    }
  }

  startMonitoringEndpoint() {
    this.task = setInterval(() => {
      this.monitorUrl();
    }, this.endpoint.monitorInterval * 1000);
  }

  stopMonitoringEndpoint() {
    clearInterval(this.task);
  }

  private async monitorUrl() {
    console.log("monitoring " + this.endpoint.name);
    const response = await this.requestUrl(this.endpoint.url);
    this.saveResult(response);
  }

  private async requestUrl(url: string) {
    return new Promise<Response>((res, rej) => {
      request.get(url, undefined, (err, response, body) => {
        res(response);
      });
    });
  }

  private async saveResult(response: Response) {
    const monitoringResult = new MonitoringResult();
    monitoringResult.endpointID = this.endpoint.id;
    monitoringResult.statusCode = response.statusCode;
    monitoringResult.payload = response.body;

    try {
      await monitoringResultsService.create(monitoringResult);
    } catch (e) {
      console.error("AN ERROR OCCURRED SAVING MONITORING RESULT: " + e.message);
    }
  }
}
