import { expect, assert } from "chai";
import * as fs from "fs";
import { Path, Thread } from "../dist";
import { sleep } from "../dist/utils";

/* eslint-disable @typescript-eslint/no-var-requires */
const xocs = require("../dist").default;

xocs.init({
  srcRoot: "test/src",
  publicRoot: "test/public",
});

const { srcRoot, publicRoot } = xocs.config;

describe("Copy from src to public directory", () => {
  it("Single file copy with perfect path", () => {
    const src = srcRoot + "/copy.html";
    const dist = publicRoot + "/pages/copy.html";

    fs.existsSync(dist) ? fs.unlinkSync(dist) : false;

    xocs.copy(srcRoot + "/copy.html", "pages");

    expect(fs.existsSync(dist)).to.eq(true);
  });

  it("Multi file copy with glob path", async () => {
    const src1 = srcRoot + "/copy.html";
    const dist1 = publicRoot + "/pages/copy.html";
    const src2 = srcRoot + "/assets/js/copy.js";
    const dist2 = publicRoot + "/assets/js/copy.js";

    fs.existsSync(dist1) ? fs.unlinkSync(dist1) : false;
    fs.existsSync(dist2) ? fs.unlinkSync(dist2) : false;

    fs.writeFileSync(src1, "test");
    fs.writeFileSync(src2, "var a = 1;");

    xocs.copy(srcRoot + "/**/*.html", "pages");
    xocs.copy(srcRoot + "/**/*.js");

    await sleep(2000);
    assert.equal(fs.readFileSync(dist1, "utf-8"), "test");
    assert.equal(fs.readFileSync(dist2, "utf-8"), "var a = 1;");
  });
});
