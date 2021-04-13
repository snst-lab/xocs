import { expect } from "chai";
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

describe("Unlink", () => {
  it("Same extention", async () => {
    const src = srcRoot + "/unlink.html";
    const dist = publicRoot + "/pages/unlink.html";

    fs.writeFileSync(src, "test");

    const watch = xocs.watch(
      srcRoot + "/**/*.html",
      true,
      (thread: Thread, path: Path) => {
        thread.copy(path, "pages");
      }
    );
    await sleep(1000);

    expect(fs.existsSync(dist)).to.eq(true);

    fs.unlinkSync(src);
    await sleep(1000);
    watch.end();

    expect(fs.existsSync(dist)).to.eq(false);
  });
  //
  //
  it("Diferent extention", async () => {
    const src = srcRoot + "/assets/css/unlink.scss";
    const dist = publicRoot + "/assets/css/unlink.css";

    fs.writeFileSync(src, "body{display:grid;}");

    const watch = xocs.watch(srcRoot + "/**/*.scss", true, (thread: Thread) => {
      thread.sass();
    });
    await sleep(1000);

    expect(fs.existsSync(dist)).to.eq(true);

    fs.unlinkSync(src);
    await sleep(1000);
    watch.end();

    expect(fs.existsSync(dist)).to.eq(false);
  });
});
