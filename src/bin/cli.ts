#!/usr/bin/env node
import { path as npmRoot } from "app-root-path";
import { log } from "@utils/index";
import { basename } from "path";
import { GlobSync } from "glob";
import { existsSync } from "fs";

try {
  let procedure: string | null = null;

  const args = process.argv.filter((e, i) => i > 1);

  args.forEach((e, i) => {
    if (
      (args[i] === "-p" || args[i] === "--procedure") &&
      typeof args[i + 1] === "string"
    ) {
      procedure = npmRoot.replace(/\\/g, "/") + "/" + args[i + 1];
    }
  });

  if (!procedure) {
    const glob = new GlobSync(npmRoot + "/xocs.*.@(js|ts)").found;
    if (typeof glob[0] === "string") {
      procedure = glob[0];
    }
  }

  if (!procedure) {
    throw new Error(
      `Procedure file not found in npm root such as ${log.yellow("xocs.js")}`
    );
  }

  if (!existsSync(procedure)) {
    throw new Error(`Procedure file ${log.yellow(procedure)} is not found`);
  }

  require(procedure);

  log.line();
  if (process.env.NODE_ENV === "development") {
    log.done(
      `Procedure ${log.yellow(basename(procedure))} loaded as ${log.green(
        "development"
      )} environment`
    );
  } else {
    log.done(
      `Procedure ${log.yellow(basename(procedure))} loaded as ${log.red(
        "production"
      )}  environment`
    );
  }
  log.line();
  //
} catch (e) {
  log.line();
  log.fail(e.message);
  log.line();
}
