import { WatchOptions as ChokidarOption } from "chokidar";
import { Options as BrowserSyncOption } from "browser-sync";
import { ProcessOptions, AcceptedPlugin } from "postcss";
import { Options as imageminPngQuantOptions } from "imagemin-pngquant";
import imageminMozjpeg = require("imagemin-mozjpeg");
import imageminGifsicle = require("imagemin-gifsicle");
import imageminSvgo = require("imagemin-svgo");
import imageminWebp = require("imagemin-webp");

/**
 *
 *
 * @export
 * @interface Options
 */
export interface Options {
  env?: string;
  srcRoot?: string;
  publicRoot?: string;
  watch?: WatchOption;
  remote?: RemoteOption;
  browser?: BrowserOption;
  copy?: CopyOption;
  sass?: SassOption;
  postcss?: PostCssOption;
  babel?: BabelOption;
  imagemin?: ImageMinOption;
}

export type ProcessOption =
  | CopyOption
  | SassOption
  | PostCssOption
  | BabelOption
  | ImageMinOption;

/**
 * @export
 * @type WatchOption
 */
export interface WatchOption extends ChokidarOption {
  runAtStart?: boolean;
  runAtOnce?: boolean;
  throttle?: number;
}
/**
 * @export
 * @type RemoteOption
 */
export interface RemoteOption {
  timeout?: number;
  localRoot?: string;
  remoteRoot?: string;
  host?: string;
  port?: string;
  user?: string;
  password?: string;
  overwrite?: string;
}
/**
 * @export
 * @type BrowserOption
 */
export type BrowserOption = BrowserSyncOption;
/**
 *
 *
 * @export
 * @interface CopyOption
 */
export interface CopyOption {
  ext?: string;
}
/**
 *
 *
 * @export
 * @interface SassOption
 */
export interface SassOption {
  ext?: string;
}
/**
 *
 *
 * @export
 * @interface BabelOption
 */
export interface BabelOption {
  ext?: string;
}
/**
 *
 *
 * @export
 * @interface PostCssOption
 * @extends {ProcessOptions}
 */
export interface PostCssOption extends ProcessOptions {
  ext?: string;
  plugins?: AcceptedPlugin;
}
/**
 *
 *
 * @export
 * @interface ImageMinOption
 */
export interface ImageMinOption {
  timeout?: number;
  ext?: string;
  pngquant: imageminPngQuantOptions;
  mozjpeg: imageminMozjpeg.Options;
  gifsicle: imageminGifsicle.Options;
  svgo: imageminSvgo.Options;
  webp: imageminWebp.Options;
}
