/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ora from "ora";
import * as chalk from "chalk";
/**
 * @class Logger
 */
class Logger {
  private spinner: ora.Ora;
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
  private typecast(message: any): string {
    return typeof message === "string"
      ? message
      : JSON.stringify(message, null, 2);
  }
  /**
   * @param {*} message
   */
  loading(message: any): void {
    this.spinner.stop();
    this.spinner = ora(this.typecast(message));
    this.spinner.start();
  }
  /**
   * @param {*} message
   */
  ready(message: any): void {
    this.spinner.stop();
    this.spinner = ora(
      chalk.black.bgCyan("READY") + " " + this.typecast(message)
    );
    this.spinner.start();
  }
  /**
   * @param {*} message
   */
  info(message: any): void {
    this.spinner.stop();
    this.spinner.info(
      chalk.black.bgBlue("INFO") + " " + this.typecast(message)
    );
  }
  /**
   * @param {*} message
   */
  done(message: any): void {
    this.spinner.succeed(
      chalk.black.bgGreen("DONE") + " " + this.typecast(message)
    );
  }
  /**
   * @param {*} message
   */
  fail(message: any): void {
    this.spinner.fail(chalk.black.bgRed("FAIL") + " " + this.typecast(message));
  }

  stop(): void {
    this.spinner.stop();
  }

  line(): void {
    console.log(
      chalk.gray(
        "--------------------------------------------------------------"
      )
    );
  }

  green(message: any): string {
    return chalk.green(message);
  }
  blue(message: any): string {
    return chalk.blue(message);
  }
  cyan(message: any): string {
    return chalk.cyan(message);
  }
  yellow(message: any): string {
    return chalk.yellow(message);
  }
  magenta(message: any): string {
    return chalk.magenta(message);
  }
  red(message: any): string {
    return chalk.redBright(message);
  }
}
export const log = new Logger();
