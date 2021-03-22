import { Path, PostCssOption } from "@types";
import { iProcessor } from "@interfaces/index";
/**
 *
 *
 * @export
 * @interface iPostCss
 * @extends {iProcessor}
 */
export interface iPostCss extends iProcessor {
  process(_srcPath: Path, _distPath: Path, options?: PostCssOption): void;
}
