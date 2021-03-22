import { Path, PostCssOption } from "@types";
import { iPostCss } from "@interfaces/index";
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
 * @implements {iPostCss}
 */
export class PostCss extends Processor implements iPostCss {
  private options: PostCssOption;

  constructor() {
    super();
    this.options = conf.options.postcss || { ext: "css" };
  }
  /**
   *
   *
   * @param {Path} _srcPath
   * @param {Path} _distPath
   * @param {PostCssOption} [options]
   * @memberof PostCss
   */
  process(_srcPath: Path, _distPath: Path, options?: PostCssOption): void {
    if (options) {
      this.options = Object.assign(this.options, options);
    }
    log.ready(`Now processing postcss from: ${log.yellow(_srcPath)}`);

    execSync(
      `npx postcss ${_srcPath} -o ${_distPath} ${this.isDev ? "" : "--no-map"}`
    );

    setTimeout(() => {
      log.done(`Postcss processed to: ${log.yellow(_distPath)}`);
    }, 100);
  }
}
