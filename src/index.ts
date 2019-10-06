import "reflect-metadata";
import { ApiServer } from "./server/index";
import { DatabaseProvider } from "./database/index";
import MonitoringPanel from "./monitor";

DatabaseProvider.configure({
  type: (process.env.DATABASE_TYPE as any) || "mysql",
  database: process.env.DATABASE_NAME || "monitoring",
  username: process.env.DATABASE_USERNAME || "root",
  password: process.env.DATABASE_PASSWORD || "",
  host: process.env.DATABASE_HOST || "localhost",
  port: +process.env.DATABASE_PORT || 3306,
  ssl: !!process.env.USE_SSL
});

const server = new ApiServer();
server.start(+process.env.PORT || 8080);

const monitorPanel = new MonitoringPanel();
monitorPanel.startCheckingMonitoredEndpoints();
