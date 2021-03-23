import { WatchOptions as ChokidarOption } from "chokidar";
import { Options as BrowserSyncOption } from "browser-sync";
import { ProcessOptions, AcceptedPlugin } from "postcss";
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
  imagemin?: ImageMinOption;
}

export type ProcessOption =
  | CopyOption
  | SassOption
  | PostCssOption
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
  mozjpeg: any;
  pngquant: any;
  gifsicle: any;
  svgo: any;
  webp: any;
}
