import { expect, assert } from "chai";
import * as fs from "fs";
import { Thread } from "../dist";
import { sleep } from "../dist/utils";

/* eslint-disable @typescript-eslint/no-var-requires */
const xocs = require("../dist");
xocs.init({
  srcRoot: "test/src",
  publicRoot: "test/public",
});

const { srcRoot, publicRoot } = xocs.config;

describe("Sass compile and postcss", () => {
  it("Single file compile", async () => {
    const src = srcRoot + "/assets/css/sass.scss";
    const dist = publicRoot + "/assets/css/sass.css";

    fs.existsSync(dist) ? fs.unlinkSync(dist) : false;

    fs.writeFileSync(src, "body{display:grid;}");

    xocs.sass(src).postcss();
    await sleep(500);

    expect(fs.existsSync(dist)).to.eq(true);
  });

  it("Multi file compile", async () => {
    const src1 = srcRoot + "/assets/css/sass.scss";
    const dist1 = publicRoot + "/assets/css/sass.css";
    const src2 = srcRoot + "/assets/css/sass2.scss";
    const dist2 = publicRoot + "/assets/css/sass2.css";

    fs.existsSync(dist1) ? fs.unlinkSync(dist1) : false;
    fs.existsSync(dist2) ? fs.unlinkSync(dist2) : false;

    fs.writeFileSync(src1, "body{display:grid;}");
    fs.writeFileSync(src2, "body{display:grid;}");

    xocs.sass(srcRoot + "/**/*.scss").postcss();

    await sleep(1000);

    expect(fs.existsSync(dist1)).to.eq(true);
    expect(fs.existsSync(dist2)).to.eq(true);
  });

  it("Multi file compile with watcher", async () => {
    const src1 = srcRoot + "/assets/css/sass.scss";
    const dist1 = publicRoot + "/assets/css/sass.css";
    const src2 = srcRoot + "/assets/css/sass2.scss";
    const dist2 = publicRoot + "/assets/css/sass2.css";

    fs.existsSync(dist1) ? fs.unlinkSync(dist1) : false;
    fs.existsSync(dist2) ? fs.unlinkSync(dist2) : false;

    fs.writeFileSync(src1, "body{display:grid;}");
    fs.writeFileSync(src2, "body{display:grid;}");

    xocs.watch(srcRoot + "/**/*.scss", true, (thread: Thread) => {
      thread.sass().postcss();
      thread.end();
    });
    await sleep(1000);

    expect(fs.existsSync(dist1)).to.eq(true);
    expect(fs.existsSync(dist2)).to.eq(true);
  });
});
