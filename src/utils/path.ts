import { Path } from "@types";
import * as pathOrigin from "path";

const inject = {
  norm: function (pathStr: Path): Path {
    let buffer: Path = pathStr;
    buffer = buffer.replace(/\\/g, "/");
    if (!/^\.\//.test(buffer) && !/^\//.test(buffer)) {
      buffer = "./" + buffer;
    }
    if (/\/$/.test(buffer)) {
      buffer = buffer.slice(0, -1);
    }
    return buffer;
  },
  normNoDot: function (pathStr: Path): Path {
    let buffer: Path = pathStr;
    buffer = buffer.replace(/\\/g, "/");
    if (buffer === ".") {
      buffer = "";
    } else {
      if (/^\.\//.test(buffer)) {
        buffer = buffer.replace("./", "");
      }
      if (/\/$/.test(buffer)) {
        buffer = buffer.slice(0, -1);
      }
    }
    return buffer;
  },
  isGrob: function (pathStr: Path | null): boolean {
    if (!pathStr) {
      return false;
    }
    return pathStr.indexOf("*") > -1 || pathStr.indexOf("?") > -1;
  },
  baseName: function (pathStr: Path | null): string | boolean {
    if (!pathStr) {
      return false;
    }
    const pathDir = pathStr.substr(0, pathStr.lastIndexOf("/")) + "/";
    return pathStr.replace(pathDir, "");
  },
};
export const path = Object.assign(pathOrigin, inject);
export const isGlob = inject.isGrob;
export const norm = inject.norm;
export const normNoDot = inject.normNoDot;
export const baseName = inject.baseName;
