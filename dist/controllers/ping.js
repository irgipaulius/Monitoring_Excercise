"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PingController = /** @class */ (function () {
    function PingController() {
    }
    PingController.prototype.initialize = function (httpServer) {
        httpServer.get("/ping", function (req, res) { return res.send(200, "hello"); });
    };
    return PingController;
}());
exports.PingController = PingController;
