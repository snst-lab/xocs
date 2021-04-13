import { expect } from "chai";
import * as fs from "fs";
import { Thread } from "../src";
import { sleep } from "../src/utils";

/* eslint-disable @typescript-eslint/no-var-requires */
const xocs = require("../src").default;

xocs.init({
  srcRoot: "test/src",
  publicRoot: "test/public",
});

const { srcRoot, publicRoot } = xocs.config;

describe("JS transpile with babel", () => {
  it("Single file transpile", async () => {
    const src = srcRoot + "/assets/js/babel.js";
    const dist = publicRoot + "/assets/js/babel.js";

    fs.existsSync(dist) ? fs.unlinkSync(dist) : false;
    fs.writeFileSync(src, "const a = () => true;");

    xocs.babel(srcRoot + "/assets/js/babel.js");
    await sleep(500);

    expect(fs.existsSync(dist)).to.eq(true);
  });
  //
  //
  it("Multi file transpile", async () => {
    const src1 = srcRoot + "/assets/js/babel.js";
    const dist1 = publicRoot + "/assets/js/babel.js";
    const src2 = srcRoot + "/assets/js/babel2.js";
    const dist2 = publicRoot + "/assets/js/babel2.js";

    fs.existsSync(dist1) ? fs.unlinkSync(dist1) : false;
    fs.existsSync(dist2) ? fs.unlinkSync(dist2) : false;
    fs.writeFileSync(src1, "const a = () => true;");
    fs.writeFileSync(src2, "const b = () => false;");

    xocs.babel(srcRoot + "/assets/js/**/*.js");
    await sleep(500);

    expect(fs.existsSync(dist1)).to.eq(true);
    expect(fs.existsSync(dist2)).to.eq(true);
  });
  //
  //
  it("Multi file compile with watcher", async () => {
    const src1 = srcRoot + "/assets/js/babel.js";
    const dist1 = publicRoot + "/assets/js/babel.js";
    const src2 = srcRoot + "/assets/js/babel2.js";
    const dist2 = publicRoot + "/assets/js/babel2.js";

    fs.existsSync(dist1) ? fs.unlinkSync(dist1) : false;
    fs.existsSync(dist2) ? fs.unlinkSync(dist2) : false;
    fs.writeFileSync(src1, "const a = () => true;");
    fs.writeFileSync(src2, "const b = () => false;");

    const watch = xocs.watch(
      srcRoot + "/assets/js/**/*.js",
      true,
      (thread: Thread) => {
        thread.babel();
      }
    );
    watch.end();

    await sleep(1000);
    expect(fs.existsSync(dist1)).to.eq(true);
    expect(fs.existsSync(dist2)).to.eq(true);
  });
});
