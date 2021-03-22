import { Path, ProcessOption } from "@types";
/**
 *
 *
 * @export
 * @interface iProcessor
 */
export interface iProcessor {
  process(srcPath: Path, distPath: Path, options?: ProcessOption): void;
  unlink(srcPath: Path | null, distPath: Path | null): void;
}
