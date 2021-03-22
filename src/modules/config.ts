import { Options } from "@types";
import { iConfig } from "@interfaces/index";
import { log } from "@utils/index";
import { path as npmRoot } from "app-root-path";
/**
 *
 *
 * @export
 * @class Config
 */
export class Config implements iConfig {
  public defaultOptions: Options;
  public options: Options;
  /**
   * Creates an instance of Config.
   * @memberof Config
   */
  constructor() {
    this.defaultOptions = {
      envFile: ".env",
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
        // eslint-disable-next-line
        require(npmRoot + "/postcss.config")
      ),
      imagemin: Object.assign(
        {
          timeout: 8000,
          mozjpeg: {},
          pngquant: {},
          gifsicle: {},
          svgo: {},
          webp: {},
        },
        // eslint-disable-next-line
        require(npmRoot + "/imagemin.config")
      ),
    };
    this.options = this.defaultOptions;
  }
  /**
   *
   *
   * @param {Options} [options]
   * @memberof Config
   */
  async init(options?: Options): Promise<void> {
    this.options = Object.assign(this.defaultOptions, options);
    // eslint-disable-next-line
    require("dotenv").config({
      path: npmRoot + "/" + this.options.envFile,
    });
  }
  /**
   *
   *
   * @param {Options} [options]
   * @memberof Config
   */
  async reset(options?: Options): Promise<void> {
    this.options = Object.assign(this.defaultOptions, options);
    // eslint-disable-next-line
    require("dotenv").config({
      path: npmRoot + "/" + this.options.envFile,
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
