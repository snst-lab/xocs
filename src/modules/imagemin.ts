import { Path, ImageMinOption } from "@types";
import { iImageMin } from "@interfaces/index";
import { Processor } from "@modules/index";
import { log, listen } from "@utils/index";
import { statSync, existsSync } from "fs";
import { dirname, extname } from "path";
import * as imagemin from "imagemin";
import * as imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant"; // ! Only pngquant has default export
import * as imageminGifsicle from "imagemin-gifsicle";
import * as imageminSvgo from "imagemin-svgo";
import * as imageminWebp from "imagemin-webp";
import conf from "./config";
/**
 *
 *
 * @export
 * @class ImageMin
 * @extends {Processor}
 * @implements {iImageMin}
 */
export class ImageMin extends Processor implements iImageMin {
  private options: ImageMinOption;
  /**
   * Creates an instance of ImageMin.
   * @memberof ImageMin
   */
  constructor() {
    super();
    this.options = conf.options.imagemin || {
      timeout: 8000,
      mozjpeg: {},
      pngquant: {},
      gifsicle: {},
      svgo: {},
      webp: {},
    };
  }
  /**
   *
   *
   * @private
   * @param {Path} srcPath
   * @return {*}  {*}
   * @memberof ImageMin
   */
  private choosePlugin(srcPath: Path): imagemin.Plugin | string {
    const ext = extname(srcPath);
    if (
      ext === ".jpg" ||
      ext === ".jpeg" ||
      ext === ".JPG" ||
      ext === ".JPEG"
    ) {
      return imageminMozjpeg(this.options.mozjpeg);
    } else if (ext === ".png" || ext === ".PNG") {
      return imageminPngquant(this.options.pngquant);
    } else if (ext === ".gif" || ext === ".GIF") {
      return imageminGifsicle(this.options.gifsicle);
    } else if (ext === ".svg" || ext === ".SVG") {
      return imageminSvgo(this.options.svgo);
    } else if (ext === ".webp" || ext === ".WEBP") {
      return imageminWebp(this.options.webp);
    } else {
      return ext;
    }
  }
  /**
   *
   *
   * @param {Path} _srcPath
   * @param {Path} _distPath
   * @param {SassOption} [options]
   * @memberof Sass
   */
  process(_srcPath: Path, _distPath: Path, options?: ImageMinOption): void {
    if (options) {
      this.options = Object.assign(this.options, options);
    }
    log.ready(`Now compress image from: ${log.yellow(_srcPath)}`);

    const plugin = this.choosePlugin(_srcPath);

    if (typeof plugin === "string") {
      log.fail(`Unknown image file format '${plugin}' passed`);
      return;
    }

    imagemin([_srcPath], {
      destination: dirname(_distPath),
      plugins: [plugin as imagemin.Plugin],
    });

    log.ready(`Compressing ${log.yellow(_srcPath)} ...`);

    listen(500, this.options.timeout || 8000, () => existsSync(_distPath))
      .then(() => {
        const beforeSize = statSync(_srcPath).size;
        const afterSize = statSync(_distPath).size;
        const reduced =
          beforeSize !== 0 ? (afterSize / beforeSize - 1) * 100 : 0;
        log.done(
          `Compressed image to ${log.yellow(_distPath)} ${log.green(
            `[${beforeSize * 0.001} kb => ${
              afterSize * 0.001
            } kb (${reduced.toFixed(2)}%)]`
          )}`
        );
        return;
      })
      .catch(() => {
        log.fail(
          `[Failed to compress image] ${log.yellow(_srcPath)} due to timeout ${
            this.options.timeout
          }ms exceeded`
        );
        return;
      });
  }
}
