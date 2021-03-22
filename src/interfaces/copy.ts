import { Path, CopyOption } from "@types";
import { iProcessor } from "@interfaces/index";

/**
 * @export
 * @interface iCopy
 */
export interface iCopy extends iProcessor {
  process(_srcPath: Path, _distPath: Path, options?: CopyOption): void;
}
