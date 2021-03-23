import {
  Path,
  Options,
  WatchOption,
  ProcessOption,
  CopyOption,
  SassOption,
  PostCssOption,
  ImageMinOption,
} from "@types";
import {
  iThread,
  iWatcher,
  iProcessor,
  iCopy,
  iSass,
  iPostCss,
  iImageMin,
} from "@interfaces/index";
import { Watcher, Browser, Remote, PathMapper } from "@modules/index";
import { isGlob, log, normNoDot } from "@utils/index";
import conf from "./config";
import store from "./store";
import { GlobSync } from "glob";
import { statSync, renameSync } from "fs";
import { execSync } from "child_process";
/**
 *
 *
 * @export
 * @class Thread
 * @implements {Thread}
 */
export class Thread implements iThread {
  private _watcher: iWatcher | null;
  private srcRoot: Path;
  private distRoot: Path;
  public unlink: boolean;
  public pathMap: [Path | null, Path | null][];
  public isWatch: boolean;

  constructor() {
    this._watcher = null;
    this.srcRoot =
      typeof conf.options.srcRoot === "string"
        ? normNoDot(conf.options.srcRoot)
        : ".";
    this.distRoot =
      typeof conf.options.publicRoot === "string"
        ? normNoDot(conf.options.publicRoot)
        : ".";
    this.pathMap = [[null, null]];
    this.isWatch = false;
    this.unlink = false;
  }
  /**
   *
   *
   * @param {(string | ReadonlyArray<string>)} srcPattern
   * @param {(...[callback: ()=>void]
   *       | [option: WatchOption, callback: ()=>void]
   *       | [runAtStart: boolean, callback: ()=>void])} args
   * @return {*}  {Thread}
   * @memberof Thread
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
          callback: (rag0: Thread, arg1: string, arg2: string) => void
        ]
  ): Thread {
    this._watcher = new Watcher(this, srcPattern, ...args);
    return this;
  }
  end(): void {
    this.isWatch = false;
    this._watcher?.close();
  }
  /**
   *
   *
   * @template T
   * @param {keyof Options} prop
   * @param {(...[]
   *       | [srcPath: Path]
   *       | [options: ProcessOption]
   *       | [srcPath: Path, options: ProcessOption]
   *       | [srcPath: Path, distPath: Path]
   *       | [srcPath: Path, distPath: Path, options: ProcessOption])} args
   * @return {*}  {Thread}
   * @memberof Thread
   */
  process<T extends iProcessor>(
    prop: keyof Options,
    ...args:
      | []
      | [srcPath: Path]
      | [options: ProcessOption]
      | [srcPath: Path, options: ProcessOption]
      | [srcPath: Path, distPath: Path]
      | [srcPath: Path, distPath: Path, options: ProcessOption]
  ): Thread {
    const mapper = new PathMapper(
      conf.options,
      this.srcRoot,
      this.distRoot,
      this.isWatch,
      this.unlink
    );
    const res = mapper.parse(args, prop, this.pathMap);
    if (!res.success) {
      log.fail(res.message);
      return this;
    }
    for (const e of res.pathMap) {
      if (!this.unlink && e[0] && e[1]) {
        if (/\s/.test(e[0])) {
          renameSync(e[0], e[0].replace(/\s/g, "_"));
          continue;
        }
        store.get<T>(prop).process(e[0], e[1], res.option);
      } else {
        store.get<T>(prop).unlink(e[0], e[1]);
      }
    }
    this.pathMap = res.pathMap;
    return this;
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
   * @memberof Thread
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
    return this.process<iCopy>("copy", ...args);
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
   * @memberof Thread
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
    return this.process<iSass>("sass", ...args);
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
   * @memberof Thread
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
    return this.process<iPostCss>("postcss", ...args);
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
   * @memberof Thread
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
    return this.process<iImageMin>("imagemin", ...args);
  }
  /**
   *
   *
   * @param {string} command
   * @memberof Thread
   */
  exec(command: string): Thread {
    log.ready(command);
    execSync(command, {
      stdio: "inherit",
    });
    log.done(command);

    // const splitedCommand = command.split(" ");
    // const args = splitedCommand.filter((e, i) => i > 0);

    // spawnSync(splitedCommand[0], [...args], {
    //   env: process.env,
    //   cwd: __dirname,
    //   stdio: "inherit",
    // });
    return this;
  }
  /**
   *
   *
   * @return {*}  {Thread}
   * @memberof Thread
   */
  reload(): Thread {
    const browser = store.get<Browser>("browser");
    if (!Object.keys(browser).length) {
      log.fail("[Reload failed] BrowserSync has not started");
      return this;
    }
    browser.reload();
    return this;
  }
  /**
   *
   *
   * @param {Path} [localPath]
   * @return {*}  {Thread}
   * @memberof Thread
   */
  upload(localPath?: Path): Thread {
    if (this.unlink) {
      return this;
    }
    const remote = store.get<Remote>("remote");

    if (typeof localPath === "string") {
      if (isGlob(localPath)) {
        const paths = new GlobSync(localPath).found;
        for (const e of paths) {
          if (statSync(e).isDirectory()) {
            continue;
          }
          remote.upload(e);
        }
      } else {
        if (statSync(localPath).isDirectory()) {
          log.fail(`[Upload failed] ${localPath} is directory`);
          return this;
        }
        remote.upload(localPath);
      }
    } else {
      if (!this.pathMap[0][1]) {
        // ! target is 'src'
        if (!this.pathMap[0][0]) {
          log.fail("[Upload failed] Local file is not specified");
          return this;
        }
        for (const e of this.pathMap) {
          if (statSync(e[0] as string).isDirectory()) {
            continue;
          }
          e[1] = e[0];
          remote.upload(e[0] as string);
        }
      } else {
        // ! target is 'dist'
        for (const e of this.pathMap) {
          if (!statSync(e[1] as string).isDirectory()) {
            continue;
          }
          remote.upload(e[1] as string);
        }
      }
    }
    return this;
  }
}
