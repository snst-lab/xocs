import { Path, RemoteOption } from "@types";
import { iRemote } from "@interfaces/index";
import { log, path, listen } from "@utils/index";
import { existsSync } from "fs";
import * as Ftp from "ftp";
/**
 *
 *
 * @class Remote
 * @implements {Remote}
 */
export class Remote implements iRemote {
  private ftp: Ftp;
  private timeout: number;
  private active: boolean;
  private localRoot: string;
  private remoteRoot: string;
  private host: string;
  private port: string;
  private user: string;
  private password: string;
  /**
   * Creates an instance of Remote.
   * @param {RemoteOption} options
   * @memberof Remote
   */
  constructor(options: RemoteOption) {
    log.ready(`Creating remote connection...\n`);
    this.ftp = new Ftp();
    this.timeout =
      typeof options.timeout === "number" ? options.timeout : 60000;
    this.localRoot =
      typeof options.localRoot !== "undefined"
        ? path.normNoDot(options.localRoot)
        : "";
    this.remoteRoot =
      typeof options.remoteRoot !== "undefined"
        ? path.normNoDot(options.remoteRoot)
        : "/";
    this.host = options.host || "localhost";
    this.port = options.port || "21";
    this.user = options.user || "user";
    this.password = options.password || "pass";
    this.active = false;
    this.connect(false);
  }
  /**
   *
   *
   * @param {RemoteOption} options
   * @memberof Remote
   */
  reset(options: RemoteOption): void {
    this.timeout =
      typeof options.timeout === "number" ? options.timeout : 60000;
    this.localRoot =
      typeof options.localRoot !== "undefined"
        ? path.normNoDot(options.localRoot)
        : "";
    this.remoteRoot =
      typeof options.remoteRoot !== "undefined"
        ? path.normNoDot(options.remoteRoot)
        : "/";
    this.host = options.host || this.host;
    this.port = options.port || this.port;
    this.user = options.user || this.user;
    this.password = options.password || this.password;
    this.connect(false);
  }
  /**
   *
   *
   * @memberof Remote
   */
  private connect(restart: boolean): boolean {
    try {
      this.ftp.connect({
        host: this.host,
        port: Number(this.port),
        user: this.user,
        password: this.password,
      });
      this.active = true;

      if (!restart) {
        log.line();
        console.log({
          host: this.host,
          port: Number(this.port),
          localRoot: this.localRoot,
          remoteRoot: this.remoteRoot,
        });
        log.line();
        log.line();
        log.done(`Remote connection started with options above`);
        log.line();
        //
      } else {
        log.info(`Remote connection restarted`);
      }
      // setTimeout(() => {
      //   this.ftp.end();
      //   this.active = false;
      // }, this.timeout);
      //
      return true;
      //
    } catch (err) {
      this.active = false;
      log.fail(`Cannot start remote connection`);
      return false;
    }
  }
  /**
   *
   *
   * @param {Path} _localPath
   * @param {Path} [remoteDir]
   * @return {*}  {Array<Path>}
   * @memberof Remote
   */
  private calcRemotePath(_localPath: Path, _remoteDir?: Path): [Path, Path] {
    let remotePath: Path;
    let remoteDir: Path;

    _localPath = path.normNoDot(_localPath);
    if (new RegExp(this.localRoot).test(_localPath)) {
      remotePath = _localPath.replace(this.localRoot, this.remoteRoot);
    } else {
      remotePath = this.remoteRoot + "/" + _localPath;
    }
    if (typeof _remoteDir === "undefined") {
      remoteDir = path.dirname(remotePath);
    } else {
      remoteDir = path.normNoDot(_remoteDir);
    }
    return [remotePath, remoteDir];
  }
  /**
   *
   *
   * @param {Path} _localPath
   * @param {Path} [_remoteDir]
   * @return {*}  {Path}
   * @memberof Remote
   */
  upload(_localPath: Path, _remoteDir?: Path): void {
    let complete = false;
    if (!existsSync(_localPath)) {
      log.fail(
        `[Upload failed] Local file  ${log.cyan(_localPath)} is not found`
      );
      return;
    }
    if (!this.active) {
      if (!this.connect(true)) {
        return;
      }
    }
    const [remotePath, remoteDir] = this.calcRemotePath(_localPath, _remoteDir);

    try {
      setTimeout(() => {
        log.loading(
          `Uploading... ${log.yellow(_localPath)} => [${log.cyan(
            this.host
          )}]${log.yellow(remotePath)}`
        );

        this.ftp.mkdir(remoteDir, true, (err) => {
          if (err) {
            throw new Error(err.message);
          }
          this.ftp.put(_localPath, remotePath, (err) => {
            if (err) {
              throw new Error(err.message);
            }
            complete = true;
          });
        });

        listen(500, this.timeout, () => complete)
          .then(() => {
            this.showProgress(_localPath, remotePath);
          })
          .catch(() => {
            log.fail(
              `[Failed to upload] Connection timeout ${this.timeout}ms exceeded`
            );
          });
      }, 500);

      //
    } catch (err) {
      log.fail(err.message);
      return;
    }
  }
  /**
   *
   *
   * @private
   * @param {Path} localPath
   * @param {Path} remotePath
   * @return {*}
   * @memberof Remote
   */
  private showProgress(localPath: Path, remotePath: Path) {
    let iteration = 0;
    const progress = setInterval(() => {
      if (iteration < 65) {
        log.loading("=".repeat(iteration));
        iteration += 1;
      } else {
        log.done(
          `Uploaded ${log.yellow(localPath)} => [${log.cyan(
            this.host
          )}]${log.yellow(remotePath)}`
        );
        clearInterval(progress);
      }
    }, 5);
  }
}
