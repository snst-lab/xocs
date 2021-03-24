import { Path, CopyOption } from "@types";
import { iProcessor } from "./processor";
/**
 *
 *
 * @export
 * @interface iCopy
 */
export interface iCopy extends iProcessor {
  process(srcPath: Path, distPath: Path, options?: CopyOption): void;
}
