import { Path, SassOption } from "@types";
import { iSass } from "@interfaces/index";
import { Processor } from "@modules/index";
import { log } from "@utils/index";
import { execSync } from "child_process";
import conf from "./config";
/**
 *
 *
 * @export
 * @class Sass
 * @extends {Processor}
 * @implements {iSass}
 */
export class Sass extends Processor implements iSass {
  private options: SassOption;
  /**
   * Creates an instance of Sass.
   * @memberof Sass
   */
  constructor() {
    super();
    this.options = conf.options.sass || { ext: "css" };
  }
  /**
   *
   *
   * @param {Path} _srcPath
   * @param {Path} _distPath
   * @param {SassOption} [options]
   * @memberof Sass
   */
  process(_srcPath: Path, _distPath: Path, options?: SassOption): void {
    if (options) {
      this.options = Object.assign(this.options, options);
    }
    log.ready(`Now compiling sass from: ${log.yellow(_srcPath)}`);

    execSync(
      `npx sass ${_srcPath} ${_distPath} --style ${
        this.isDev ? "expanded --no-source-map" : "compressed --no-source-map"
      }`
    );
    setTimeout(() => {
      log.done(`Compiled sass to ${log.yellow(_distPath)}`);
    }, 100);
  }
}
