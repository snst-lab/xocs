/**
 * @dev Initialize 'xocs' procedure with srcRoot & publicRoot.
 */
const xocs = require("xocs").default;

xocs.init({
  env: ".env.development", // default is ".env"
  srcRoot: "src", // default is "src"
  publicRoot: "public", // default is "public"
});

const { srcRoot, publicRoot } = xocs.config;

/**
 * @dev Watch src files to compile, imagemin, copy, etc.
 */
xocs.task("compile", () => {
  // For example, src/index.html => public/pages/index.html
  xocs.watch(srcRoot + "/**/*.@(html|php)", ($, path) => {
    $.copy(path, "pages");
  });
  xocs.watch(srcRoot + "/assets/js/**/*.js", ($) => {
    $.babel();
  });
  xocs.watch(srcRoot + "/assets/css/**/*.scss", ($) => {
    $.sass().postcss();
  });
  xocs.watch(srcRoot + "/assets/img/**/*.@(jpg|jpeg|png|gif|svg|webp)", ($) => {
    $.imagemin();
  });
});

/**
 * @dev Here, FTP_HOST etc. are defined in '.env' file using 'dotenv' module
 * @link https://www.npmjs.com/package/dotenv
 */
xocs.task("preview", () => {
  // Start BrowserSync
  xocs.browser({
    proxy: process.env.PUBLIC_URL,
  });

  // // Create FTP connection
  // xocs.remote({
  //   host: process.env.FTP_HOST,
  //   port: process.env.FTP_PORT,
  //   user: process.env.FTP_USER,
  //   password: process.env.FTP_PASS,
  //   localRoot: process.env.FTP_LOCAL_ROOT,
  //   remoteRoot: process.env.FTP_REMOTE_ROOT,
  // });

  // Upload file to remote host when files in public directory are updated & run BrowserSync
  xocs.watch([publicRoot + "/assets/**/*", publicRoot + "/pages/**/*"], ($) => {
    $.reload();
    // $.upload();
  });
});

/**
 * @dev Execute registered tasks
 */
xocs.run("compile", "preview");
