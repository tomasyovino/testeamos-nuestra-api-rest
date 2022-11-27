import log4js  from "log4js";

log4js.configure({
    appenders: {
      miLoggerConsole: { type: "console" },
      miLoggerConsoleWarn: { type: "console", filename: "warn.log" },
      miLoggerFile: { type: "file", filename: "error.log" },
    },
    categories: {
      default: { appenders: ["miLoggerConsole"], level: "info" },
      warn: { appenders: ["miLoggerConsoleWarn"], level: "warn" },
      error: { appenders: ["miLoggerFile"], level: "error" },
    },
});

const logger = log4js.getLogger();
const warnLogger = log4js.getLogger("warn");
const errorLogger = log4js.getLogger("error");

export { logger, errorLogger, warnLogger };