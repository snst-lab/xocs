import { Path, SassOption } from "@types";
import { iProcessor } from "./processor";
/**
 *
 *
 * @export
 * @interface iSass
 */
export interface iSass extends iProcessor {
  process(srcPath: Path, distPath: Path, options?: SassOption): void;
}
