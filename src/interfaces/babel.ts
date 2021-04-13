import { Path, BabelOption } from "@types";
import { iProcessor } from "./processor";
/**
 *
 *
 * @export
 * @interface iBabel
 */
export interface iBabel extends iProcessor {
  process(srcPath: Path, distPath: Path, options?: BabelOption): void;
}
