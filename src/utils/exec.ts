import { log } from "@utils/index";
import { execSync } from "child_process";

export function exec(command: string): void {
  try {
    execSync(command, {
      stdio: "inherit",
    });
    log.done(command);
  } catch (e) {
    log.fail(command);
  }
}
