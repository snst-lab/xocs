import { Path, RemoteOption } from "@types";
/**
 *
 *
 * @export
 * @interface iRemote
 */
export interface iRemote {
  reset(options: RemoteOption): void;
  upload(localPath: Path): void;
  // private connect(): void;
  // private calcRemotePath(localPath: Path, remoteDir?: Path): [Path, Path];
  // private showProgress(localPath: Path, remotePath: Path): NodeJS.Timer;
}
