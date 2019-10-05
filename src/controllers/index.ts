import { Controller } from "./controller";

import { PingController } from "./ping";

export const CONTROLLERS: Array<Controller> = [new PingController()];
