import { EventEmitter } from "events";
import { iTask } from "@interfaces/index";
/**
 *
 *
 * @export
 * @class Task
 */
export class Task implements iTask {
  private emitter: EventEmitter;
  /**
   * Creates an instance of Task.
   * @memberof Task
   */
  constructor() {
    this.emitter = new EventEmitter();
  }
  /**
   *
   *
   * @param {string} name
   * @param {Function} callback
   * @memberof Task
   */
  register(name: string, callback: () => void): void {
    this.emitter.on(name, () => {
      callback();
    });
  }
  /**
   *
   *
   * @param {string} name
   * @memberof Task
   */
  single(name: string): void {
    if (process.argv[2] === name) {
      this.emitter.emit(name);
    }
  }
  /**
   *
   *
   * @param {...string[]} names
   * @memberof Task
   */
  series(...names: string[]): void {
    names.map((name: string) => {
      this.emitter.emit(name);
    });
  }
}
