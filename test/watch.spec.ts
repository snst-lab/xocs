import { expect, assert } from "chai";
import * as fs from "fs";
import { Path, Thread } from "../src";
import { sleep } from "../src/utils";

/* eslint-disable @typescript-eslint/no-var-requires */
const xocs = require("../src").default;

xocs.init({
  srcRoot: "test/src",
  publicRoot: "test/public",
});

const { srcRoot, publicRoot } = xocs.config;

describe("Watch", () => {
  it("Simple watch and copy", async () => {
    const src = srcRoot + "/watch.html";
    const dist = publicRoot + "/pages/watch.html";

    fs.existsSync(dist) ? fs.unlinkSync(dist) : false;
    fs.writeFileSync(src, "");

    const watch = xocs.watch(
      srcRoot + "/**/*.html",
      (thread: Thread, path: Path) => {
        thread.copy(path, "pages");
      }
    );
    await sleep(500);

    fs.appendFileSync(src, "test");
    await sleep(1000);
    watch.end();

    assert.equal(fs.readFileSync(dist, "utf-8"), "test");
  });
  //
  //
  it("Simple watch and copy with runAtStart", async () => {
    const src = srcRoot + "/watch.html";
    const dist = publicRoot + "/pages/watch.html";

    fs.existsSync(dist) ? fs.unlinkSync(dist) : false;
    fs.writeFileSync(src, "test");

    const watch = xocs.watch(
      srcRoot + "/**/*.html",
      { runAtStart: true },
      (thread: Thread, path: Path) => {
        thread.copy(path, "pages");
      }
    );
    watch.end();
    await sleep(1000);

    assert.equal(fs.readFileSync(dist, "utf-8"), "test");
  });
  //
  //
  it("Watch files to compile another files", async () => {
    const src = srcRoot + "/watch.html";
    const src2 = srcRoot + "/assets/css/watch.scss";
    const dist2 = publicRoot + "/assets/css/watch.css";

    fs.existsSync(dist2) ? fs.unlinkSync(dist2) : false;
    fs.writeFileSync(src2, "body{display:grid;}");

    const watch = xocs.watch(srcRoot + "/**/*.html", (thread: Thread) => {
      thread.sass(srcRoot + "/**/*.scss");
    });
    await sleep(500);

    fs.writeFileSync(src, "test");
    await sleep(1000);
    watch.end();

    expect(fs.existsSync(dist2)).to.eq(true);
  });
});
