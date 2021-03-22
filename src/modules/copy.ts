import { Path, CopyOption } from "@types";
import { log } from "@utils/index";
import { Processor } from "@modules/index";
import { iCopy } from "@interfaces/index";
import { copyFileSync } from "fs";
import conf from "./config";

/**
 * @export
 * @class Copy
 * @implements {Copy}
 */
export class Copy extends Processor implements iCopy {
  private options: CopyOption;

  constructor() {
    super();
    this.options = conf.options.copy || {};
  }
  /**
   *
   *
   * @param {Path} _srcPath
   * @param {Path} _distPath
   * @return {*}  {Path}
   * @memberof Copy
   */
  process(_srcPath: Path, _distPath: Path, options?: CopyOption): void {
    if (options) {
      this.options = Object.assign(this.options, options);
    }
    log.ready(`Now copying from: ${log.yellow(_srcPath)}`);

    copyFileSync(_srcPath, _distPath);

    setTimeout(() => {
      log.done(`Copyed to ${log.yellow(_distPath)}`);
    }, 100);
  }
}
