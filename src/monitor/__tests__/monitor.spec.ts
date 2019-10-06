jest.mock("../../services/monitoredEndpoints");
jest.mock("../../services/monitoredResults");
jest.mock("request");
jest.useFakeTimers();

import Monitor from "../monitor";
import { monitoringResultsService } from "../../services/monitoredResults";
import { MonitoredEndpoints } from "../../models/monitoredEndpoints";
import request, { Response } from "request";
import { MonitoringResult } from "../../models/monitoringResult";

function mockSetInterval(fn: any) {
  fn.mockImplementation(
    jest.fn((cb: any, time: number) => {
      cb();
      return time;
    })
  );
}

function mockRequestGet(fn: any, err: any, res: any) {
  fn.mockImplementation(jest.fn((a, b, cb) => cb(err, res, res && res.body)));
}

function mockPromiseFunction(fn: any, result: any) {
  fn.mockImplementation(jest.fn(async () => result));
}

function mockPromiseFailFunction(fn: any, err: any) {
  fn.mockImplementation(
    jest.fn(async () => {
      throw new Error(err);
    })
  );
}

let monitor: Monitor;
beforeEach(() => {
  jest.clearAllMocks();
  monitor = new Monitor(endpointExample1, false);
  mockSetInterval(setInterval);
  mockPromiseFunction(monitoringResultsService.create, []);
  mockRequestGet(request.get, undefined, responseExample1);
});

describe("monitor/", () => {
  describe("monitor.ts:", () => {
    describe("class Monitor:", () => {
      describe("constructor():", () => {
        it("should init endpoint without starting monitoring", () => {
          expect(monitor.endpoint).toEqual(endpointExample1);
        });
      });

      describe("saveResult():", () => {
        it("should send new monitoringResult to monitoringResultsService.create", async done => {
          //@ts-ignore
          await monitor.saveResult(responseExample1);

          expect(monitoringResultsService.create).toHaveBeenCalledTimes(1);
          expect(monitoringResultsService.create).toHaveBeenCalledWith(
            monitoringResultsExample1
          );

          done();
        });

        it("should not freak out if an error occurs while saving results", async done => {
          mockPromiseFailFunction(monitoringResultsService.create, "KYS");
          //@ts-ignore
          await monitor.saveResult(responseExample1);

          expect(monitoringResultsService.create).toHaveBeenCalledTimes(1);
          expect(monitor.saveResult).not.toThrow();

          done();
        });
      });

      describe("requestUrl():", () => {
        it("should perform GET request and return undefined", async done => {
          mockRequestGet(request.get, undefined, undefined);
          //@ts-ignore
          const response = await monitor.requestUrl("test@url.com");

          expect(request.get).toBeCalledWith(
            "test@url.com",
            undefined,
            expect.any(Function)
          );
          expect(response).toEqual(undefined);
          done();
        });

        it("should perform GET request and return error message", async done => {
          mockRequestGet(request.get, "omg help me", undefined);
          //@ts-ignore
          const response = await monitor.requestUrl("test@url.com");

          expect(request.get).toBeCalledWith(
            "test@url.com",
            undefined,
            expect.any(Function)
          );
          expect(response).toEqual("omg help me");
          done();
        });

        it("should perform GET request and return response body message", async done => {
          mockRequestGet(request.get, undefined, "omg such awesome");
          //@ts-ignore
          const response = await monitor.requestUrl("test@url.com");

          expect(request.get).toBeCalledWith(
            "test@url.com",
            undefined,
            expect.any(Function)
          );
          expect(response).toEqual("omg such awesome");
          done();
        });
      });

      describe("monitorUrl():", () => {
        it("should save requested data to db", async done => {
          //@ts-ignore
          const saveSpy = jest.spyOn(monitor, "saveResult");
          //@ts-ignore
          const reqSpy = jest.spyOn(monitor, "requestUrl");

          //@ts-ignore
          await monitor.monitorUrl();

          expect(reqSpy).toBeCalledWith(endpointExample1.url);
          expect(saveSpy).toBeCalledWith(responseExample1);
          expect(monitoringResultsService.create).toHaveBeenCalledWith(
            monitoringResultsExample1
          );

          done();
        });
      });

      describe("startMonitoringEndpoint():", () => {
        it("should start setInterval and trigger monitorUrl() every 1000ms. also set task.", async done => {
          //@ts-ignore
          const spy = jest.spyOn(monitor, "monitorUrl");

          monitor.startMonitoringEndpoint();

          expect(setInterval).toBeCalledWith(expect.any(Function), 1000);
          expect(spy).toBeCalledTimes(1);
          expect(monitor.task).toEqual(1000);
          done();
        });
      });

      describe("stopMonitoringEndpoint():", () => {
        it("should clearInterval using task variable", async done => {
          //@ts-ignore
          monitor.task = 1000;

          monitor.stopMonitoringEndpoint();

          expect(monitor.task).toEqual(1000);
          expect(clearInterval).toBeCalledWith(1000);
          done();
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
  monitorInterval: 1,
  ownerId: 2
};

const bodyExample1: string = "test body string";

//@ts-ignore
const responseExample1: Response = {
  statusCode: 200,
  body: bodyExample1
};

//@ts-ignore
const monitoringResultsExample1: MonitoringResult = {
  endpointID: 1,
  statusCode: responseExample1.statusCode,
  payload: responseExample1.body
};
