import { Path, ImageMinOption } from "@types";
import { iProcessor } from "@interfaces/index";
/**
 *
 *
 * @export
 * @interface iImageMin
 * @extends {iProcessor}
 */
export interface iImageMin extends iProcessor {
  process(_srcPath: Path, _distPath: Path, options?: ImageMinOption): void;
}
