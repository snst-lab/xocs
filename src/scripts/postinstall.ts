import * as path from "path";
import { path as npmRoot } from "app-root-path";
import * as fs from "fs";
import { log } from "@utils/index";

const creates = [
  [
    path.resolve(__dirname, "xocs.mix.js"),
    path.resolve(npmRoot, "xocs.mix.js"),
  ],
  [
    path.resolve(__dirname, ".browserslistrc"),
    path.resolve(npmRoot, ".browserslistrc"),
  ],
  [
    path.resolve(__dirname, "postcss.config.js"),
    path.resolve(npmRoot, "postcss.config.js"),
  ],
  [
    path.resolve(__dirname, "imagemin.config.js"),
    path.resolve(npmRoot, "imagemin.config.js"),
  ],
];

const appends = [
  [path.resolve(__dirname, ".env"), path.resolve(npmRoot, ".env.development")],
];

creates.map((e) => {
  if (!fs.existsSync(e[1])) {
    log.ready(
      log.green(`File copying ${log.yellow(e[0])} => ${log.yellow(e[1])}`)
    );
    fs.copyFileSync(e[0], e[1]);
    log.done(
      log.green(`File copied  ${log.yellow(e[0])} => ${log.yellow(e[1])}`)
    );
  }
});

appends.map((e) => {
  if (!fs.existsSync(e[1])) {
    log.ready(
      log.green(`File copying ${log.yellow(e[0])} => ${log.yellow(e[1])}`)
    );
    fs.copyFileSync(e[0], e[1]);
    log.done(
      log.green(`File copied  ${log.yellow(e[0])} => ${log.yellow(e[1])}`)
    );
  } else {
    log.ready(
      log.green(`Appending ${log.yellow(e[0])} => ${log.yellow(e[1])}`)
    );
    const src = fs.readFileSync(e[0], "utf8");
    fs.appendFileSync(e[1], "\n\n" + src);
    log.done(log.green(`Appending ${log.yellow(e[0])} => ${log.yellow(e[1])}`));
  }
});
