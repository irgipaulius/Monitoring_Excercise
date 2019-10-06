import { Controller } from "./controller";

import { PingController } from "./ping";
import { UserController } from "./user";
import { MonitoredEndpointsController } from "./monitoredEndpoints";
import { MonitoringResultController } from "./monitoringResult";

export const CONTROLLERS: Array<Controller> = [
  new PingController(),
  new UserController(),
  new MonitoredEndpointsController(),
  new MonitoringResultController()
];
