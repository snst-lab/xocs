import { Path, Options, RemoteOption, BrowserOption } from "@types";
import { Thread } from "@modules/index";
import { iThread } from "@interfaces/index";
/**
 *
 *
 * @export
 * @interface iCore
 * @extends {iThread}
 */
export interface iCore extends iThread {
  init(options?: Options): void;
  task(name: string, callback: () => void): void;
  run(...names: string[]): void;
  browser(options?: BrowserOption): void;
  remote(options: RemoteOption): void;
  /**
   * @dev Belows overrides parent interface
   */
  reload(): any;
  upload(localPath: Path): Thread;
  end(): void;
}
