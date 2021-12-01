import { hostname } from "os";
import pino from "pino";

const logger = pino({
  name: "nodejs-tls",
  base: {
    pid: process.pid,
    hostname: hostname(),
  },
});
export default logger;
