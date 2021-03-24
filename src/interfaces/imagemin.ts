import { Path, ImageMinOption } from "@types";
import { iProcessor } from "./processor";
/**
 *
 *
 * @export
 * @interface iImageMin
 */
export interface iImageMin extends iProcessor {
  process(srcPath: Path, distPath: Path, options?: ImageMinOption): void;
}
