import { Path, SassOption } from "@types";
import { iProcessor } from "@interfaces/index";
/**
 *
 *
 * @export
 * @interface iSass
 * @extends {iProcessor}
 */
export interface iSass extends iProcessor {
  process(_srcPath: Path, _distPath: Path, options?: SassOption): void;
}
