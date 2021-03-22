import {
  Path,
  WatchOption,
  CopyOption,
  SassOption,
  PostCssOption,
  ImageMinOption,
} from "@types";
import { Thread } from "@modules/index";
/**
 *
 *
 * @export
 * @interface iThread
 */
export interface iThread {
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
  ): Thread;
  exec(command: string): Thread;
  reload(): Thread;
  upload(localPath?: Path): Thread;
  end(): void;
  copy(
    ...args:
      | []
      | [distPath: Path]
      | [options: CopyOption]
      | [distPath: Path, options: CopyOption]
      | [srcPath: Path, distPath: Path]
      | [srcPath: Path, distPath: Path, options: CopyOption]
  ): Thread;
  sass(
    ...args:
      | []
      | [distPath: Path]
      | [options: SassOption]
      | [distPath: Path, options: SassOption]
      | [srcPath: Path, distPath: Path]
      | [srcPath: Path, distPath: Path, options: SassOption]
  ): Thread;
  postcss(
    ...args:
      | []
      | [distPath: Path]
      | [options: PostCssOption]
      | [distPath: Path, options: PostCssOption]
      | [srcPath: Path, distPath: Path]
      | [srcPath: Path, distPath: Path, options: PostCssOption]
  ): Thread;
  imagemin(
    ...args:
      | []
      | [distPath: Path]
      | [options: ImageMinOption]
      | [distPath: Path, options: ImageMinOption]
      | [srcPath: Path, distPath: Path]
      | [srcPath: Path, distPath: Path, options: ImageMinOption]
  ): Thread;
}
