import { WatchOption } from "@types";
import { Thread } from "./thread";
import { iWatcher } from "@interfaces/index";
import { log, normNoDot } from "@utils/index";
import { watch, FSWatcher } from "chokidar";
import conf from "./config";
import { GlobSync } from "glob";

/**
 * @export
 * @class Watcher
 */
export class Watcher implements iWatcher {
  private watcher: FSWatcher | null;
  private thread: Thread;
  private runAtStart: boolean;
  private runAtOnce: boolean;
  private throttle: number;
  private listen: boolean;
  public callback: (thread?: Thread, path?: string, event?: string) => void;
  /**
   * Creates an instance of Watcher.
   * @param {(string | ReadonlyArray<string>)} [srcPattern]
   * @memberof Watcher
   */
  constructor(
    thread: Thread,
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
  ) {
    this.watcher = null;
    this.thread = thread;
    this.runAtStart = false;
    this.runAtOnce = false;
    this.throttle = 0;
    this.listen = true;
    this.callback = () => {
      return;
    };
    this.parse(srcPattern, ...args);
  }
  /**
   *
   *
   * @param {(string | ReadonlyArray<string>)} srcPattern
   * @param {(...[callback: ()=>void]
   *       | [option: WatchOption, callback: ()=>void]
   *       | [runAtStart: boolean, callback: ()=>void])} args
   * @memberof Watcher
   */
  parse(
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
  ): void {
    if (typeof args[0] === "function" && typeof args[1] === "undefined") {
      const option = {} as WatchOption;
      this.callback = args[0] as () => void;
      this.start(srcPattern, option);
      //
      //
    } else if (
      typeof args[0] !== "boolean" &&
      typeof args[0] !== "undefined" &&
      typeof args[1] === "function"
    ) {
      const option = args[0] as WatchOption;

      this.callback = args[1] as () => void;
      this.runAtStart =
        typeof option.runAtStart !== "undefined"
          ? (option.runAtStart as boolean)
          : false;
      this.runAtOnce =
        typeof option.runAtOnce !== "undefined"
          ? (option.runAtStart as boolean)
          : false;
      this.throttle =
        typeof option.throttle !== "undefined"
          ? (option.throttle as number)
          : 0;
      delete option.runAtStart;
      delete option.runAtOnce;
      delete option.throttle;
      this.start(srcPattern, option);
      //
      //
    } else if (args[0] === true && typeof args[1] === "function") {
      const option = {} as WatchOption;
      this.runAtStart = true;
      this.callback = args[1] as () => void;
      this.start(srcPattern, option);
      //
      //
    } else {
      log.fail("Watcher option is invalid");
    }
  }
  /**
   *
   *
   * @param {(string | ReadonlyArray<string>)} srcPattern
   * @param {WatchOption} _option
   * @memberof Watcher
   */
  start(
    _srcPattern: string | ReadonlyArray<string>,
    _option: WatchOption
  ): void {
    const option = Object.assign(conf.options.watch, _option);
    this.watcher = watch(_srcPattern, option);

    this.watcher.on("ready", () => {
      log.info(`Watching file changes in ${log.yellow(_srcPattern)}`);

      if (this.runAtStart) {
        this.thread.isWatch = true;
        this.thread.unlink = false;
        if (typeof _srcPattern === "string") {
          // ! If string passed , procedure as single glob pattern
          this.thread.pathMap = [[normNoDot(_srcPattern), null]];
          this.callback(this.thread, "", "ready");
          //
        } else if (typeof _srcPattern !== "string") {
          // ! If array passed , loop for each glob patterns
          for (const e of _srcPattern) {
            const paths = new GlobSync(e).found;

            for (const f of paths) {
              this.thread.pathMap = [[normNoDot(f), null]];
              // ! If pathMap updated to includes multi files, skip callback
              if (!this.thread.pathMap[1]) {
                this.callback(this.thread, "", "ready");
              }
              if (this.runAtOnce) break;
            }
            if (this.runAtOnce) break;
          }
        }
      }

      this.watcher?.on("all", (event, path) => {
        if (this.listen) {
          // ! No loop for each files watched within throttle time.
          if (this.throttle > 0) {
            this.listen = false;
            setTimeout(() => {
              this.listen = true;
            }, this.throttle);
          }
          //
          this.thread.isWatch = true;
          this.thread.pathMap = [[normNoDot(path), null]];
          if (event === "add" || event === "change") {
            // ! If pathMap updated to includes multi files, skip callback
            if (!this.thread.pathMap[1]) {
              this.thread.unlink = false;
              this.callback(this.thread, path, event);
            }
          } else if (event === "unlink") {
            // ! If pathMap updated to includes multi files, skip callback
            if (!this.thread.pathMap[1]) {
              this.thread.unlink = true;
              this.callback(this.thread, path, event);
            }
          }
        }
      });
    });
  }
  /**
   *
   *
   * @memberof Watcher
   */
  close(): void {
    this.watcher?.close();
  }
}
