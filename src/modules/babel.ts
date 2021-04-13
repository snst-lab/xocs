import { Path, BabelOption } from "@types";
import { iBabel } from "@interfaces/index";
import { Processor } from "@modules/index";
import { log } from "@utils/index";
import { execSync } from "child_process";
import conf from "./config";
/**
 *
 *
 * @export
 * @class PostCss
 * @extends {Processor}
 * @implements {iBabel}
 */
export class Babel extends Processor implements iBabel {
  private options: BabelOption;
  /**
   * Creates an instance of PostCss.
   * @memberof Babel
   */
  constructor() {
    super();
    this.options = conf.options.babel || { ext: "js" };
  }
  /**
   *
   *
   * @param {Path} _srcPath
   * @param {Path} _distPath
   * @param {BabelOption} [options]
   * @memberof Babel
   */
  process(_srcPath: Path, _distPath: Path, options?: BabelOption): void {
    if (options) {
      this.options = Object.assign(this.options, options);
    }
    log.ready(`Now transpiling JavaScript from: ${log.yellow(_srcPath)}`);

    execSync(
      `npx babel ${_srcPath} --out-file ${_distPath} ${
        this.isDev ? "--source-maps" : ""
      }`
    );

    setTimeout(() => {
      log.done(`JavaScript transpiled to: ${log.yellow(_distPath)}`);
    }, 100);
  }
}
