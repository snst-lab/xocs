import { BrowserOption } from "@types";
import { iBrowser } from "@interfaces/index";
import { log } from "@utils/index";
import { init, reload, BrowserSyncInstance } from "browser-sync";
import conf from "@modules/config";
/**
 *
 *
 * @export
 * @class Browser
 * @implements {Browser}
 */
export class Browser implements iBrowser {
  private url: string;
  /**
   * Creates an instance of Browser.
   * @param {BrowserOption} [option]
   * @memberof Browser
   */
  constructor(option?: BrowserOption) {
    this.url = "http://localhost:3000";

    option = Object.assign(conf.options.browser, option);

    init(option, (err: Error, instance: BrowserSyncInstance) => {
      setTimeout(() => {
        log.ready(`Starting BrowserSync...\n`);
        this.url = instance.getOption("urls").get("external");
        log.line();
        console.log(option);
        log.line();
        log.line();
        log.done(`BrowserSync started with options above`);
        log.info(log.cyan(this.url));
        log.line();
      }, 500);
    });
  }
  /**
   *
   *
   * @memberof Browser
   */
  reload(): void {
    setTimeout(() => {
      reload();
      console.log("\n");
      log.line();
      log.done(`BrowserSync reloaded`);
      log.info(log.cyan(this.url));
      log.line();
    }, 1000);
  }
}
