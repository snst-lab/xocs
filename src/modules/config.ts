import { Options } from "@types";
import { iConfig } from "@interfaces/index";
import { log } from "@utils/index";
import { resolve } from "path";
import { existsSync } from "fs";
/**
 *
 *
 * @export
 * @class Config
 */
export class Config implements iConfig {
  public defaultOptions: Options;
  public options: Options;
  public npmRoot: string;
  /**
   * Creates an instance of Config.
   * @memberof Config
   */
  constructor() {
    this.npmRoot = resolve(process.cwd());
    this.defaultOptions = {
      env: ".env",
      srcRoot: "src",
      publicRoot: "public",
      watch: {
        // ignored: /[\/\\]\./, //ignored dot file
        ignoreInitial: true,
        persistent: true,
        usePolling: true,
        interval: 1000,
        alwaysStat: false,
      },
      remote: {
        timeout: 60000,
      },
      browser: {
        open: "external",
        port: 3000,
        reloadThrottle: 500,
        watch: false,
        ghostMode: false,
        ui: false,
        notify: false,
        logLevel: "silent",
      },
      copy: {},
      sass: {
        ext: "css",
      },
      postcss: Object.assign(
        {
          ext: "css",
        },
        this.load("postcss.config")
      ),
      babel: Object.assign({
        ext: "js",
      }),
      imagemin: Object.assign(
        {
          timeout: 8000,
          mozjpeg: {},
          pngquant: {},
          gifsicle: {},
          svgo: {},
          webp: {},
        },
        this.load("imagemin.config")
      ),
    };
    this.options = this.defaultOptions;
  }
  /**
   *
   *
   * @private
   * @param {string} fileName
   * @return {*}  {NodeRequire}
   * @memberof Config
   */
  private load(fileName: string): NodeRequire {
    const filePath = this.npmRoot + "/" + fileName;
    return existsSync(filePath) ? require(filePath) : {};
  }
  /**
   *
   *
   * @param {Options} [options]
   * @memberof Config
   */
  init(options?: Options): void {
    this.options = Object.assign(this.defaultOptions, options);
    // eslint-disable-next-line
    require("dotenv").config({
      path: this.npmRoot + "/" + this.options.env,
    });
  }
  /**
   *
   *
   * @param {Options} [options]
   * @memberof Config
   */
  reset(options?: Options): void {
    this.options = Object.assign(this.defaultOptions, options);
    // eslint-disable-next-line
    require("dotenv").config({
      path: this.npmRoot + "/" + this.options.env,
    });
    log.line();
    console.log(this.options);
    log.line();
    log.info(log.green(`Common options successfully updated.`));
    log.line();
  }
}

const conf = new Config();
export default conf;
