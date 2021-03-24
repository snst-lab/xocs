/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ora from "ora";
import * as chalk from "chalk";
/**
 * @class Logger
 */
class Logger {
  private spinner;
  /**
   * Creates an instance of Logger.
   */
  constructor() {
    this.spinner = ora();
  }
  /**
   * @param {*} message
   * @return {*}
   */
  typecast(message: any) {
    return typeof message === "string"
      ? message
      : JSON.stringify(message, null, 2);
  }
  /**
   * @param {*} message
   */
  loading(message: any) {
    this.spinner.stop();
    this.spinner = ora(this.typecast(message));
    this.spinner.start();
  }
  /**
   * @param {*} message
   */
  ready(message: any) {
    this.spinner.stop();
    this.spinner = ora(
      chalk.black.bgCyan("READY") + " " + this.typecast(message)
    );
    this.spinner.start();
  }
  /**
   * @param {*} message
   */
  info(message: any) {
    this.spinner.stop();
    this.spinner.info(
      chalk.black.bgBlue("INFO") + " " + this.typecast(message)
    );
  }
  /**
   * @param {*} message
   */
  done(message: any) {
    this.spinner.succeed(
      chalk.black.bgGreen("DONE") + " " + this.typecast(message)
    );
  }
  /**
   * @param {*} message
   */
  fail(message: any) {
    this.spinner.fail(chalk.black.bgRed("FAIL") + " " + this.typecast(message));
  }

  stop() {
    this.spinner.stop();
  }

  line() {
    console.log(
      chalk.gray(
        "--------------------------------------------------------------"
      )
    );
  }

  green(message: any) {
    return chalk.green(message);
  }
  blue(message: any) {
    return chalk.blue(message);
  }
  cyan(message: any) {
    return chalk.cyan(message);
  }
  yellow(message: any) {
    return chalk.yellow(message);
  }
  magenta(message: any) {
    return chalk.magenta(message);
  }
  red(message: any) {
    return chalk.redBright(message);
  }
}
export const log = new Logger();
