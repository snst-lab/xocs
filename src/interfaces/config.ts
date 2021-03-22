import { Options } from "@types";
/**
 *
 *
 * @export
 * @interface iConfig
 */
export interface iConfig {
  options: Options;
  init(options?: Options): void;
  reset(options?: Options): void;
}
