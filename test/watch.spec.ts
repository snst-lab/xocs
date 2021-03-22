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

describe("Watch", () => {
  it("Simple watch and copy", async () => {
    const src = srcRoot + "/watch.html";
    const dist = publicRoot + "/watch.html";

    fs.existsSync(dist) ? fs.unlinkSync(dist) : false;
    fs.writeFileSync(src, "");

    xocs.watch(srcRoot + "/**/*.html", (thread: Thread) => {
      thread.copy();
      thread.end();
    });

    await sleep(500);

    fs.appendFileSync(src, "test");

    await sleep(1000);

    assert.equal(fs.readFileSync(dist, "utf-8"), "test");
  });

  it("Simple watch and copy with runAtStart", async () => {
    const src = srcRoot + "/watch.html";
    const dist = publicRoot + "/watch.html";

    fs.existsSync(dist) ? fs.unlinkSync(dist) : false;
    fs.writeFileSync(src, "test");

    xocs.watch(
      srcRoot + "/**/*.html",
      { runAtStart: true },
      (thread: Thread) => {
        thread.copy().end();
      }
    );

    await sleep(2000);
    assert.equal(fs.readFileSync(dist, "utf-8"), "test");
  });

  it("Watch files to compile another files", async () => {
    const src = srcRoot + "/watch.html";
    const dist = publicRoot + "/watch.html";
    const src2 = srcRoot + "/assets/css/watch.scss";
    const dist2 = publicRoot + "/assets/css/watch.css";

    fs.existsSync(dist2) ? fs.unlinkSync(dist2) : false;
    fs.writeFileSync(src2, "body{display:grid;}");

    const thread = xocs.watch("test/src/**/*.html", (thread: Thread) => {
      thread.sass(srcRoot + "/**/*.scss");
    });
    await sleep(500);

    fs.writeFileSync(src, "test");
    await sleep(2000);

    thread.end();

    expect(fs.existsSync(dist)).to.eq(false);
  });
});
