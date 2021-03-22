import { Path, Options, ProcessOption } from "@types";
import { GlobSync } from "glob";
import { mkdirSync } from "fs";
import { isGlob, normNoDot, baseName } from "@utils/index";

type PathMap = [src: Path | null, dist: Path | null][];
/**
 *
 *
 * @interface Result
 */
interface Result {
  success: boolean;
  message: string;
  pathMap: PathMap;
  option: ProcessOption;
}
/**
 *
 *
 * @export
 * @class PathMapper
 */
export class PathMapper {
  private options: Options;
  private srcRoot: Path;
  private distRoot: Path;
  private isWatch: boolean;
  private unlink: boolean;
  private ext: string | null;

  constructor(
    options: Options,
    srcRoot: Path,
    distRoot: Path,
    isWatch: boolean,
    unlink: boolean
  ) {
    this.options = options;
    this.srcRoot = srcRoot; //! pre normalizeed in thread
    this.distRoot = distRoot; //! pre normalizeed in thread
    this.isWatch = isWatch;
    this.unlink = unlink;
    this.ext = null;
  }
  /**
   *
   *
   * @private
   * @param {Path} pathStr
   * @param {keyof Options} prop
   * @param {Path} additionalDistDir
   * @return {*}  {PathMap}
   * @memberof PathMapper
   */
  private initPathMap(
    pathStr: Path,
    prop: keyof Options,
    additionalDistDir: Path | null
  ): PathMap {
    if (typeof additionalDistDir === "string") {
      this.distRoot = this.distRoot + "/" + normNoDot(additionalDistDir);
    }
    pathStr = normNoDot(pathStr);

    if (!isGlob(pathStr)) {
      const _distPath = this.distRoot + pathStr.replace(this.srcRoot, "");
      const distDir = this.getDistDir(_distPath);
      const distPath = this.changeExt(distDir, _distPath);
      // console.log([[pathStr, distPath]]);
      return [[pathStr, distPath]];
      //
      //
    } else {
      const _paths = new GlobSync(pathStr).found;
      const paths: PathMap = [];
      let distDir = "";
      _paths.forEach((e, i) => {
        const _distPath = this.distRoot + e.replace(this.srcRoot, "");
        if (i === 0) distDir = this.getDistDir(_distPath);
        const distPath = this.changeExt(distDir, _distPath);
        paths.push([e, distPath]);
      });
      // console.log(paths);
      return paths;
    }
  }
  /**
   *
   *
   * @private
   * @param {PathMap} pathMap
   * @param {keyof Options} prop
   * @param {Path} additionalDistDir
   * @return {*}  {PathMap}
   * @memberof PathMapper
   */
  private updatePathMap(
    pathMap: PathMap,
    prop: keyof Options,
    additionalDistDir: Path | null
  ): PathMap {
    if (!pathMap[0][1]) {
      return pathMap;
    }
    if (!additionalDistDir) {
      if (pathMap[0][0] !== pathMap[0][1]) {
        // ! Re-map at only second step
        const distDir = this.getDistDir(pathMap[0][1]);
        pathMap.forEach((e) => {
          e[0] = this.changeExt(distDir, e[1] as string);
        });
      }
      //
      //
    } else {
      // cf. core.scss('src/*.scss').postcss('another/')
      this.distRoot = this.distRoot + "/" + normNoDot(additionalDistDir) + "/";
      // ! when update, end slash if required
      let distDir = "";
      pathMap.forEach((e, i) => {
        if (i === 0) distDir = this.getDistDir(e[1]);
        const distPath = this.changeExt(distDir, e[1] as string);
        e[0] = distPath;
        e[1] = this.distRoot + baseName(distPath);
      });
    }
    return pathMap;
  }
  /**
   *
   *
   * @private
   * @param {(Path | null)} distPath
   * @return {*}  {Path}
   * @memberof PathMapper
   */
  private getDistDir(distPath: Path | null): Path {
    if (!distPath) {
      return "";
    }
    const distDir = distPath.substr(0, distPath.lastIndexOf("/")) + "/";
    if (!this.unlink) {
      mkdirSync(distDir, { recursive: true });
    }
    return distDir;
  }
  /**
   *
   *
   * @private
   * @param {Path} distDir
   * @param {(Path | null)} distPath
   * @param {string} ext
   * @return {*}  {(Path | null)}
   * @memberof PathMapper
   */
  private changeExt(distDir: Path, distPath: Path): Path | null {
    if (!this.ext) {
      return distPath;
    }
    const baseName = distPath.replace(distDir, "");
    return (
      distDir + baseName.substr(0, baseName.lastIndexOf(".")) + "." + this.ext
    );
  }
  /**
   *
   *
   * @private
   * @param {keyof Options} prop
   * @return {*}  {boolean}
   * @memberof PathMapper
   */
  private getExt(prop: keyof Options): boolean {
    if (typeof prop !== "string") {
      return false;
    }
    if (typeof this.options[prop] === "undefined") {
      return false;
    }
    const ext = (this.options[prop] as ProcessOption).ext;
    if (typeof ext !== "string") {
      return true;
    } else {
      this.ext = ext;
      return true;
    }
  }

  /**
   *
   *
   * @param {*} args
   * @param {keyof Options} prop
   * @param {PathMap} pathMap
   * @return {*}  {Result}
   * @memberof PathMapper
   */
  parse(args: any, prop: keyof Options, pathMap: PathMap): Result {
    try {
      if (!this.getExt(prop)) {
        throw new Error(
          `No extention (such as .html,.css ...) configuration found for '${prop}' process`
        );
      }

      let option: ProcessOption = {};

      switch (args.length) {
        case 0:
          if (this.isWatch && !pathMap[0][1] /* isFirstStep */) {
            // cf. thread.copy()
            if (pathMap[0][0])
              pathMap = this.initPathMap(pathMap[0][0], prop, null);
            option =
              prop in this.options ? (this.options[prop] as ProcessOption) : {};
            //
            //
          } else if (this.isWatch && pathMap[0][1]) {
            // cf. thread.copy().copy()
            pathMap = [[pathMap[0][1], pathMap[0][1]]];
            option =
              prop in this.options ? (this.options[prop] as ProcessOption) : {};
            //
            //
          } else if (!this.isWatch && !pathMap[0][1] /* isFirstStep */) {
            // cf. core.copy()
            throw new Error("Some argument is required");
            //
            //
          } else {
            // cf. core.scss('src/*.scss').postcss()
            pathMap = this.updatePathMap(pathMap, prop, null);
            option =
              prop in this.options ? (this.options[prop] as ProcessOption) : {};
            //
            //
          }
          break;
        case 1:
          if (
            this.isWatch &&
            !pathMap[0][1] /* isFirstStep */ &&
            typeof args[0] === "string"
          ) {
            // cf. thread.scss('another/*.scss')
            pathMap = this.initPathMap(args[0], prop, null);
            option =
              prop in this.options ? (this.options[prop] as ProcessOption) : {};
            //
            //
          } else if (
            this.isWatch &&
            !pathMap[0][1] /* isFirstStep */ &&
            typeof args[0] === "object"
          ) {
            // cf. thread.scss({ minify: true })
            if (pathMap[0][0])
              pathMap = this.initPathMap(pathMap[0][0], prop, null);
            option = args[0];
            //
            //
          } else if (
            this.isWatch &&
            pathMap[0][1] /* noFirstStep */ &&
            typeof args[0] === "string"
          ) {
            // cf. thread.scss().postcss('another/index.css')
            pathMap = [[pathMap[0][1], args[0]]];
            option =
              prop in this.options ? (this.options[prop] as ProcessOption) : {};
            //
            //
          } else if (
            this.isWatch &&
            pathMap[0][1] /* noFirstStep */ &&
            typeof args[0] === "object"
          ) {
            // cf. thread.scss().postcss({ minify: true })
            pathMap = [[pathMap[0][1], pathMap[0][1]]];
            option = args[0];
            //
            //
          } else if (
            !this.isWatch &&
            !pathMap[0][1] /* isFirstStep */ &&
            typeof args[0] === "string"
          ) {
            // cf. core.scss('src/*.css')
            pathMap = this.initPathMap(args[0], prop, null);
            option =
              prop in this.options ? (this.options[prop] as ProcessOption) : {};
            //
            //
          } else if (
            !this.isWatch &&
            !pathMap[0][1] /* isFirstStep */ &&
            typeof args[0] === "object"
          ) {
            // cf. core.scss({ minify: true })
            throw new Error("Source file is required");
            //
            //
          } else if (
            !this.isWatch &&
            pathMap[0][1] /* noFirstStep */ &&
            typeof args[0] === "string"
          ) {
            // cf. core.scss('src/*.scss').postcss('another/')
            pathMap = this.updatePathMap(pathMap, prop, args[0]);
            option =
              prop in this.options ? (this.options[prop] as ProcessOption) : {};
            //
            //
          } else if (
            !this.isWatch &&
            pathMap[0][1] /* noFirstStep */ &&
            typeof args[0] === "object"
          ) {
            // cf. core.scss('src/index.scss').postcss({ minify: true })
            pathMap = this.updatePathMap(pathMap, prop, null);
            //
            //
          } else {
            throw new Error("Types of arguments are invalid");
            //
            //
          }
          break;
        case 2:
          if (
            this.isWatch &&
            !pathMap[0][1] /* isFirstStep */ &&
            typeof args[0] === "string" &&
            typeof args[1] === "string"
          ) {
            // cf. thread.scss('another/*.css','another/');
            // cf. thread.scss('src/only.css','another/');
            pathMap = this.initPathMap(args[0], prop, args[1]);
            option =
              prop in this.options ? (this.options[prop] as ProcessOption) : {};
            //
            //
          } else if (
            this.isWatch &&
            !pathMap[0][1] /* isFirstStep */ &&
            typeof args[0] === "string" &&
            typeof args[1] === "object"
          ) {
            // cf. thread.scss('another/src.scss',{ minifiy: true})
            pathMap = this.initPathMap(args[0], prop, null);
            option = args[1];
            //
            //
          } else if (
            this.isWatch &&
            pathMap[0][1] /* noFirstStep */ &&
            typeof args[0] === "string" &&
            typeof args[1] === "string"
          ) {
            // cf. thread.scss().postcss('another/*.css','another/');
            pathMap = this.initPathMap(args[0], prop, args[1]);
            option =
              prop in this.options ? (this.options[prop] as ProcessOption) : {};
            //
            //
          } else if (
            this.isWatch &&
            pathMap[0][1] /* noFirstStep */ &&
            typeof args[0] === "string" &&
            typeof args[1] === "object"
          ) {
            // cf. thread.scss().postcss('another/src.scss',{ minify:true });
            pathMap = this.initPathMap(args[0], prop, null);
            option = args[1];
            //
            //
          } else if (
            !this.isWatch &&
            !pathMap[0][1] /* isFirstStep */ &&
            typeof args[0] === "string" &&
            typeof args[1] === "string"
          ) {
            // cf. core.scss('src/*.scss','public/')
            pathMap = this.initPathMap(args[0], prop, args[1]);
            option =
              prop in this.options ? (this.options[prop] as ProcessOption) : {};
            //
            //
          } else if (
            !this.isWatch &&
            !pathMap[0][1] /* isFirstStep */ &&
            typeof args[0] === "string" &&
            typeof args[1] === "object"
          ) {
            // cf. core.scss('src/*.scss',{ minify:true})
            pathMap = this.initPathMap(args[0], prop, null);
            option = args[1];
            //
          } else if (
            !this.isWatch &&
            pathMap[0][1] /* noFirstStep */ &&
            typeof args[0] === "string" &&
            typeof args[1] === "string"
          ) {
            // cf. core.scss().postcss('another/*.css','another2/');
            // cf. core.scss().postcss('public/only.css','another/');
            pathMap = this.initPathMap(args[0], prop, args[1]);
            option =
              prop in this.options ? (this.options[prop] as ProcessOption) : {};
            //
            //
          } else if (
            !this.isWatch &&
            pathMap[0][1] /* noFirstStep */ &&
            typeof args[0] === "string" &&
            typeof args[1] === "object"
          ) {
            // cf. core.scss().postcss('another/*.css','another2/');
            // cf. core.scss().postcss('public/only.css',{ minify:true});
            pathMap = this.initPathMap(args[0], prop, null);
            option = args[1];
            //
            //
          } else {
            throw new Error("Types of arguments are invalid");
          }
          break;
        case 3:
          if (
            typeof args[0] === "string" &&
            typeof args[1] === "string" &&
            typeof args[2] === "object"
          ) {
            // cf. core.sass('another/*.css','another2/');
            // cf. core.sass().postcss('another/*.css','another2/');
            // cf. core.sass().postcss('public/only.css','another/');
            pathMap = this.initPathMap(args[0], prop, args[1]);
            option = args[2];
            //
            //
          } else {
            throw new Error("Types of arguments are invalid");
          }
          break;
        default:
          throw new Error("Too much arguments are passed");
      }
      return {
        success: true,
        message: "",
        pathMap: pathMap,
        option: option,
      };
    } catch (e) {
      return {
        success: false,
        message: e.message,
        pathMap: [],
        option: {},
      };
    }
  }
}
