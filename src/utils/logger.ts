import chalk from "chalk";

const error = chalk.bold.red;
const warn = chalk.hex("#FFA500");
const info = chalk.blueBright;
const success = chalk.green;

let DEBUG = !!(process.env.DEBUG || process.env.REACT_APP_DEBUG);
const SILENCE = !!(process.env.SILENCE_LOGS || process.env.REACT_APP_SILENCE_LOGS);

export const enableDebug = (): void => {
  DEBUG = true;
};

enableDebug();
const print = (...args: any[]): void => {
  if (!SILENCE) console.log(...args);
};

export const logger = {
  error: (...args: any[]): void => print(error(...args)),
  warn: (...args: any[]): void => print(warn(...args)),
  info: (...args: any[]): void => print(info(...args)),
  success: (...args: any[]): void => print(success(...args)),
  debug: (...args: any[]): void => {
    if (DEBUG) print(info(...args));
  },
  log: (...args: any[]): void => print(...args)
};
