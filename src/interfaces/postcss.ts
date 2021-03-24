import { Path, PostCssOption } from "@types";
import { iProcessor } from "./processor";
/**
 *
 *
 * @export
 * @interface iPostCss
 */
export interface iPostCss extends iProcessor {
  process(srcPath: Path, distPath: Path, options?: PostCssOption): void;
}
