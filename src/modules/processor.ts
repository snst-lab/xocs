import { Path, ProcessOption } from "@types";
import { iProcessor } from "@interfaces/index";
import { log } from "@utils/index";
import { existsSync, unlink } from "fs";
/**
 *
 *
 * @export
 * @abstract
 * @class Processor
 * @implements {iProcessor}
 */
export abstract class Processor implements iProcessor {
  protected isDev: boolean;

  constructor() {
    this.isDev = process.env.NODE_ENV === "development";
  }
  /**
   *
   *
   * @param {Path} srcPath
   * @param {Path} distPath
   * @param {ProcessOption} [options]
   * @return {*}  {Path}
   * @memberof Processor
   */
  process(srcPath: Path, distPath: Path, options?: ProcessOption): void {
    return;
  }
  /**
   *
   *
   * @param {Path} _srcPath
   * @param {Path} _distPath
   * @return {*}  {Path}
   * @memberof Processor
   */
  unlink(_srcPath: Path | null, _distPath: Path): void {
    if (!_srcPath) {
      return;
    }
    if (existsSync(_distPath)) {
      unlink(_distPath, () => {
        log.info(`Removed file: ${log.red(_distPath)}`);
      });
    }
  }
}
