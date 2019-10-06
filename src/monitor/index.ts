import { DatabaseProvider } from "../database";
import { MonitoredEndpoints } from "../models/monitoredEndpoints";
import { monitoredEndpointsService } from "../services/monitoredEndpoints";
import Monitor from "./monitor";

const CHANGES_CHECK_INTERVAL = 10;

export default class MonitoringPanel {
  monitors: Monitor[];
  constructor() {
    this.monitors = [];
  }

  startCheckingMonitoredEndpoints() {
    setInterval(() => {
      this.checkMonitoredEndpoints();
    }, CHANGES_CHECK_INTERVAL * 1000);
  }

  private async checkMonitoredEndpoints() {
    const allEndpoints = await monitoredEndpointsService.getAllEndpoints();
    console.log(
      "checking for changes in the database: " +
        allEndpoints.length +
        "/" +
        this.monitors.length
    );

    // this is a "difference" - it's purpose is to get all allEndpoints that are NOT in the this.monitor[]
    // principle: const diff = arrA.filter(a => !arrB.includes(a));
    const unmonitoredEndpoints = allEndpoints.filter(
      endpoint =>
        !this.monitors.find(monitor => monitor.endpoint.id === endpoint.id)
    );

    // get all monitors
    const outdatedMonitors = this.monitors.filter(
      monitor =>
        !allEndpoints.find(endpoint => endpoint.id === monitor.endpoint.id)
    );

    unmonitoredEndpoints.map(endpoint => this.startNewMonitor(endpoint));
    outdatedMonitors.map(monitor => this.stopMonitor(monitor));
  }

  private startNewMonitor(endpoint: MonitoredEndpoints) {
    console.log("STARTING NEW MONITORING PROCESS ON " + endpoint.name);
    this.monitors.push(new Monitor(endpoint, true));
  }

  private stopMonitor(monitor: Monitor) {
    console.log("STOPPING MONITORING PROCESS ON " + monitor.endpoint.name);
    monitor.stopMonitoringEndpoint();
    this.monitors.splice(this.monitors.indexOf(monitor), 1);
  }
}
