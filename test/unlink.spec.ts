import { expect, assert } from "chai";
import * as fs from "fs";
import { Path, Thread } from "../dist";
import { sleep } from "../dist/utils";

/* eslint-disable @typescript-eslint/no-var-requires */
const xocs = require("../dist").init({
  srcRoot: "test/src",
  publicRoot: "test/public",
});

const { srcRoot, publicRoot } = xocs.config;

describe("Unlink", () => {
  it("Same extention", async () => {
    const src = srcRoot + "/pages/unlink.html";
    const dist = publicRoot + "/pages/unlink.html";

    fs.writeFileSync(src, "test");

    const thread = xocs.watch(
      srcRoot + "/pages/**/*.html",
      true,
      (thread: Thread) => {
        thread.copy();
      }
    );

    await sleep(1000);

    expect(fs.existsSync(dist)).to.eq(true);

    fs.unlinkSync(src);

    await sleep(1000);

    thread.end();

    expect(fs.existsSync(dist)).to.eq(false);
  });

  it("Diferent extention", async () => {
    const src = srcRoot + "/assets/css/unlink.scss";
    const dist = publicRoot + "/assets/css/unlink.css";

    fs.writeFileSync(src, "body{display:grid;}");

    const thread = xocs.watch(
      srcRoot + "/assets/**/*.scss",
      true,
      (thread: Thread) => {
        thread.sass();
      }
    );
    await sleep(1000);

    expect(fs.existsSync(dist)).to.eq(true);

    fs.unlinkSync(src);

    await sleep(1000);

    thread.end();

    expect(fs.existsSync(dist)).to.eq(false);
  });
});
