import { WatchOption } from "@types";
import { Thread } from "@modules/index";
/**
 * @export
 * @interface iWatcher
 */
export interface iWatcher {
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
  ): void;
  start(
    _srcPattern: string | ReadonlyArray<string>,
    _option: WatchOption
  ): void;
  close(): void;
}
