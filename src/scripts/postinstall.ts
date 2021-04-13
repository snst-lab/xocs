import { existsSync, copyFileSync, readFileSync, appendFileSync } from "fs";
import { resolve } from "path";
import { log } from "@utils/index";

const npmRoot = process.cwd() + "/../..";

const creates = [
  [resolve(__dirname, "xocs.mix.js"), resolve(npmRoot, "xocs.mix.js")],
  [resolve(__dirname, ".browserslistrc"), resolve(npmRoot, ".browserslistrc")],
  [
    resolve(__dirname, "postcss.config.js"),
    resolve(npmRoot, "postcss.config.js"),
  ],
  [resolve(__dirname, "babel.config.js"), resolve(npmRoot, "babel.config.js")],
  [
    resolve(__dirname, "imagemin.config.js"),
    resolve(npmRoot, "imagemin.config.js"),
  ],
];

const appends = [
  [resolve(__dirname, ".env"), resolve(npmRoot, ".env.development")],
];

creates.map((e) => {
  if (!existsSync(e[1])) {
    log.ready(
      log.green(`File copying ${log.yellow(e[0])} => ${log.yellow(e[1])}`)
    );
    copyFileSync(e[0], e[1]);
    log.done(
      log.green(`File copied  ${log.yellow(e[0])} => ${log.yellow(e[1])}`)
    );
  }
});

appends.map((e) => {
  if (!existsSync(e[1])) {
    log.ready(
      log.green(`File copying ${log.yellow(e[0])} => ${log.yellow(e[1])}`)
    );
    copyFileSync(e[0], e[1]);
    log.done(
      log.green(`File copied  ${log.yellow(e[0])} => ${log.yellow(e[1])}`)
    );
  } else {
    log.ready(
      log.green(`Appending ${log.yellow(e[0])} => ${log.yellow(e[1])}`)
    );
    const src = readFileSync(e[0], "utf8");
    appendFileSync(e[1], "\n\n" + src);
    log.done(log.green(`Appending ${log.yellow(e[0])} => ${log.yellow(e[1])}`));
  }
});
