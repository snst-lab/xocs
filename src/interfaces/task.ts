/**
 *
 *
 * @export
 * @interface iTask
 */
export interface iTask {
  register(name: string, callback: () => void): void;
  single(_name: string): void;
  series(...names: [name: string]): void;
}
