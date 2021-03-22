#!/usr/bin/env node
import { path as npmRoot } from "app-root-path";
import { log } from "@utils/index";
import { basename } from "path";
import { GlobSync } from "glob";

const procedure = new GlobSync(npmRoot + "/xocs.*.@(js|ts)").found;
if (typeof procedure[0] === "string") {
  require(procedure[0]);
  log.line();
  if (process.env.NODE_ENV === "development") {
    log.done(`Procedure ${log.yellow(basename(procedure[0]))} loaded as ${log.green("development")} environment`);
  } else {
    log.done(`Procedure ${log.yellow(basename(procedure[0]))} loaded as ${log.red("production")}  environment`);
  }
  log.line();
  //
} else {
  log.line();
  log.fail(`Procedure file not found in npm root such as ${log.yellow("xocs.js")}`);
  log.line();
}
