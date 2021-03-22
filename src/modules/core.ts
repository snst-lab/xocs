import {
  Path,
  Options,
  WatchOption,
  RemoteOption,
  BrowserOption,
  CopyOption,
  SassOption,
  PostCssOption,
  ImageMinOption,
} from "@types";
import { iCore, iCopy, iSass, iPostCss, iImageMin } from "@interfaces/index";
import {
  Task,
  Thread,
  Browser,
  Remote,
  Copy,
  Sass,
  PostCss,
  ImageMin,
} from "@modules/index";
import { log } from "@utils/index";
import conf from "./config";
import store from "./store";
/**
 *
 *
 * @export
 * @class Core
 * @implements {Core}
 */
export class Core implements iCore {
  private _task: Task | null;
  public config: Options;
  /**
   * Creates an instance of Core.
   * @memberof Core
   */
  constructor() {
    this._task = null;
    this.config = conf.options;

    store.set<iCopy>("copy", new Copy());
    store.set<iSass>("sass", new Sass());
    store.set<iPostCss>("postcss", new PostCss());
    store.set<iImageMin>("imagemin", new ImageMin());
  }
  /**
   *
   *
   * @param {Options} [options]
   * @memberof Core
   */
  init(options?: Options): Core {
    conf.init(options);
    this.config = conf.options;
    return this;
  }
  /**
   *
   *
   * @param {string} name
   * @param {Function} callback
   * @memberof Core
   */
  task(name: string, callback: () => void): void {
    if (this._task === null) {
      this._task = new Task();
    }
    this._task.register(name, callback);
  }
  /**
   *
   *
   * @param {...[name: string]} names
   * @memberof Core
   */
  run(...names: string[]): void {
    this._task?.series(...names);
  }

  /**
   *
   *
   * @param {BrowserOption} options
   * @memberof Core
   */
  browser(options?: BrowserOption): void {
    options = Object.assign(conf.options.browser, options);
    store.set("browser", new Browser(options));
  }
  reload(): void {
    log.fail(`Method '${log.cyan("browser")}' can call only from thread`);
  }
  /**
   *
   *
   * @param {RemoteOption} options
   * @memberof Core
   */
  remote(options: RemoteOption): void {
    options = Object.assign(conf.options.remote, options);
    store.set("remote", new Remote(options));
  }
  upload(localPath: Path): Thread {
    return new Thread().upload(localPath);
  }
  /**
   *
   *
   * @param {(string | ReadonlyArray<string>)} srcPattern
   * @param {(...[callback: Function]
   *       | [option: WatchOption, callback: Function]
   *       | [runAtStart: boolean, callback: Function])} args
   * @return {*}  {Thread}
   * @memberof Core
   */
  watch(
    srcPattern: string | ReadonlyArray<string>,
    ...args:
      | [callback: (arg0: Thread, arg1: string, arg2: string) => void]
      | [
          option: WatchOption,
          callback: (arg0: Thread, arg1: string, arg2: string) => void
        ]
      | [
          runAtStart: boolean,
          callback: (arg0: Thread, arg1: string, arg2: string) => void
        ]
  ): Thread {
    return new Thread().watch(srcPattern, ...args);
  }
  end(): void {
    log.fail(`Method '${log.cyan("watch")}' can call only from thread`);
  }
  /**
   *
   *
   * @param {string} command
   * @return {*}  {Thread}
   * @memberof Core
   */
  exec(command: string): Thread {
    return new Thread().exec(command);
  }
  /**
   *
   *
   * @param {(...[]
   *       | [srcPath: Path]
   *       | [options: CopyOption]
   *       | [srcPath: Path, options: CopyOption]
   *       | [srcPath: Path, distPath: Path]
   *       | [srcPath: Path, distPath: Path, options: CopyOption])} args
   * @return {*}  {Thread}
   * @memberof Core
   */
  copy(
    ...args:
      | []
      | [srcPath: Path]
      | [options: CopyOption]
      | [srcPath: Path, options: CopyOption]
      | [srcPath: Path, distPath: Path]
      | [srcPath: Path, distPath: Path, options: CopyOption]
  ): Thread {
    return new Thread().copy(...args);
  }

  /**
   *
   *
   * @param {(...[]
   *       | [srcPath: Path]
   *       | [options: SassOption]
   *       | [srcPath: Path, options: SassOption]
   *       | [srcPath: Path, distPath: Path]
   *       | [srcPath: Path, distPath: Path, options: SassOption])} args
   * @return {*}  {Thread}
   * @memberof Core
   */
  sass(
    ...args:
      | []
      | [srcPath: Path]
      | [options: SassOption]
      | [srcPath: Path, options: SassOption]
      | [srcPath: Path, distPath: Path]
      | [srcPath: Path, distPath: Path, options: SassOption]
  ): Thread {
    return new Thread().sass(...args);
  }

  /**
   *
   *
   * @param {(...[]
   *       | [srcPath: Path]
   *       | [options: PostCssOption]
   *       | [srcPath: Path, options: PostCssOption]
   *       | [srcPath: Path, distPath: Path]
   *       | [srcPath: Path, distPath: Path, options: PostCssOption])} args
   * @return {*}  {Thread}
   * @memberof Core
   */
  postcss(
    ...args:
      | []
      | [srcPath: Path]
      | [options: PostCssOption]
      | [srcPath: Path, options: PostCssOption]
      | [srcPath: Path, distPath: Path]
      | [srcPath: Path, distPath: Path, options: PostCssOption]
  ): Thread {
    return new Thread().postcss(...args);
  }
  /**
   *
   *
   * @param {(...[]
   *       | [srcPath: Path]
   *       | [options: ImageMinOption]
   *       | [srcPath: Path, options: ImageMinOption]
   *       | [srcPath: Path, distPath: Path]
   *       | [srcPath: Path, distPath: Path, options: ImageMinOption])} args
   * @return {*}  {Thread}
   * @memberof Core
   */
  imagemin(
    ...args:
      | []
      | [srcPath: Path]
      | [options: ImageMinOption]
      | [srcPath: Path, options: ImageMinOption]
      | [srcPath: Path, distPath: Path]
      | [srcPath: Path, distPath: Path, options: ImageMinOption]
  ): Thread {
    return new Thread().imagemin(...args);
  }
}
