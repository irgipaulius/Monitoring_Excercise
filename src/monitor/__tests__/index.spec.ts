jest.mock("../monitor");
jest.mock("../../services/monitoredEndpoints");
jest.useFakeTimers();

import MonitoringPanel from "../index";
import Monitor from "../monitor";
import { MonitoredEndpoints } from "../../models/monitoredEndpoints";
import { monitoredEndpointsService } from "../../services/monitoredEndpoints";

function mockSetInterval(fn: any) {
  fn.mockImplementation(jest.fn((cb: any, time: number) => cb()));
}

function mockPromiseFunction(fn: any, result: any) {
  fn.mockImplementation(jest.fn(async () => result));
}

let monitoringPanel: MonitoringPanel;
beforeEach(() => {
  jest.clearAllMocks();
  mockSetInterval(setInterval);
  mockPromiseFunction(monitoredEndpointsService.getAllEndpoints, []);
  monitoringPanel = new MonitoringPanel();
});

describe("monitor/", () => {
  describe("index.ts:", () => {
    describe("MonitoringPanel:", () => {
      describe("constructor():", () => {
        it("should init monitors", () => {
          expect(monitoringPanel.monitors).toEqual([]);
        });
      });

      describe("startNewMonitor():", () => {
        it("should call Monitor's constructor and add it's instance to monitors[]", () => {
          //@ts-ignore
          monitoringPanel.startNewMonitor(endpointExample1);
          expect(Monitor).toHaveBeenCalledTimes(1);
          expect(Monitor).toHaveBeenCalledWith(endpointExample1, true);
          expect(monitoringPanel.monitors).toEqual([expect.any(Monitor)]);
        });
      });

      describe("stopMonitor():", () => {
        it("should call stopMonitoringEndpoint method on Monitor class and delete it's instance from monitors[]", () => {
          const monitor = new Monitor(endpointExample1, false);
          monitor.endpoint = endpointExample1;
          monitoringPanel.monitors.push(monitor);
          //@ts-ignore
          monitoringPanel.stopMonitor(monitor);
          expect(monitor.stopMonitoringEndpoint).toHaveBeenCalledTimes(1);
          expect(monitoringPanel.monitors).toEqual([]);
        });
      });

      describe("checkMonitoredEndpoints():", () => {
        it("should not call startNewMonitor or stopMonitor, because there are no endpoints and no monitors", async done => {
          mockPromiseFunction(monitoredEndpointsService.getAllEndpoints, []);
          //@ts-ignore
          const startSpy = jest.spyOn(monitoringPanel, "startNewMonitor");
          //@ts-ignore
          const stopSpy = jest.spyOn(monitoringPanel, "stopMonitor");

          //@ts-ignore
          monitoringPanel.checkMonitoredEndpoints();

          expect(
            monitoredEndpointsService.getAllEndpoints
          ).toHaveBeenCalledTimes(1);
          //@ts-ignore
          expect(monitoringPanel.startNewMonitor).not.toBeCalled();
          //@ts-ignore
          expect(monitoringPanel.stopMonitor).not.toBeCalled();

          startSpy.mockRestore();
          stopSpy.mockRestore();

          done();
        });

        it("should not call startNewMonitor or stopMonitor, because every endpoint is being monitored", async done => {
          mockPromiseFunction(monitoredEndpointsService.getAllEndpoints, [
            endpointExample1,
            endpointExample2
          ]);
          monitoringPanel.monitors.push(new Monitor(endpointExample1, false));
          monitoringPanel.monitors.push(new Monitor(endpointExample2, false));
          monitoringPanel.monitors[0].endpoint = endpointExample1;
          monitoringPanel.monitors[1].endpoint = endpointExample2;

          //@ts-ignore
          const startSpy = jest.spyOn(monitoringPanel, "startNewMonitor");
          //@ts-ignore
          const stopSpy = jest.spyOn(monitoringPanel, "stopMonitor");

          //@ts-ignore
          monitoringPanel.checkMonitoredEndpoints();

          expect(
            monitoredEndpointsService.getAllEndpoints
          ).toHaveBeenCalledTimes(1);
          //@ts-ignore
          expect(monitoringPanel.startNewMonitor).not.toBeCalled();
          //@ts-ignore
          expect(monitoringPanel.stopMonitor).not.toBeCalled();

          startSpy.mockRestore();
          stopSpy.mockRestore();

          done();
        });

        it("should call only startNewMonitor, because one endpoint is not being monitored", async done => {
          mockPromiseFunction(monitoredEndpointsService.getAllEndpoints, [
            endpointExample1,
            endpointExample2
          ]);
          monitoringPanel.monitors.push(new Monitor(endpointExample1, false));
          monitoringPanel.monitors[0].endpoint = endpointExample1;

          //@ts-ignore
          const startSpy = jest.spyOn(monitoringPanel, "startNewMonitor");
          //@ts-ignore
          const stopSpy = jest.spyOn(monitoringPanel, "stopMonitor");

          //@ts-ignore
          await monitoringPanel.checkMonitoredEndpoints();

          expect(
            monitoredEndpointsService.getAllEndpoints
          ).toHaveBeenCalledTimes(1);
          //@ts-ignore
          expect(monitoringPanel.startNewMonitor).toBeCalledTimes(1);
          //@ts-ignore
          expect(monitoringPanel.startNewMonitor).toBeCalledWith(
            endpointExample2
          );
          expect(Monitor).toBeCalledTimes(2); //Monitor constructor AND Monitor.endpoints.id
          expect(Monitor).toBeCalledWith(endpointExample2, true);
          //@ts-ignore
          expect(monitoringPanel.stopMonitor).not.toBeCalled();

          startSpy.mockRestore();
          stopSpy.mockRestore();

          done();
        });

        it("should call only stopMonitor, because one outdated endpoint is being monitored", async done => {
          mockPromiseFunction(monitoredEndpointsService.getAllEndpoints, []);
          const monitorMock = new Monitor(endpointExample1, false);
          monitorMock.endpoint = endpointExample1;
          monitoringPanel.monitors.push(monitorMock);

          //@ts-ignore
          const startSpy = jest.spyOn(monitoringPanel, "startNewMonitor");
          //@ts-ignore
          const stopSpy = jest.spyOn(monitoringPanel, "stopMonitor");

          //@ts-ignore
          await monitoringPanel.checkMonitoredEndpoints();

          expect(
            monitoredEndpointsService.getAllEndpoints
          ).toHaveBeenCalledTimes(1);
          //@ts-ignore
          expect(monitoringPanel.startNewMonitor).not.toBeCalled();
          //@ts-ignore
          expect(monitoringPanel.stopMonitor).toBeCalledTimes(1);
          //@ts-ignore
          expect(monitoringPanel.stopMonitor).toBeCalledWith(monitorMock);
          expect(monitorMock.stopMonitoringEndpoint).toBeCalledTimes(1);
          expect(monitoringPanel.monitors).toEqual([]);

          startSpy.mockRestore();
          stopSpy.mockRestore();

          done();
        });
      });

      describe("startCheckingMonitoredEndpoints():", () => {
        it("should start setInterval() every 10000 ms", () => {
          //@ts-ignore
          const spy = jest.spyOn(monitoringPanel, "checkMonitoredEndpoints");

          monitoringPanel.startCheckingMonitoredEndpoints();

          expect(spy).toBeCalledTimes(1);
          expect(setInterval).toHaveBeenCalledTimes(1);
          expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 10000);
        });
      });
    });
  });
});

const endpointExample1: MonitoredEndpoints = {
  name: "test",
  id: 1,
  url: "test@test.com",
  created: new Date(),
  checked: new Date(),
  monitorInterval: 100,
  ownerId: 2
};

const endpointExample2: MonitoredEndpoints = {
  name: "test13",
  id: 13,
  url: "test@test.com",
  created: new Date(),
  checked: new Date(),
  monitorInterval: 130,
  ownerId: 3
};
