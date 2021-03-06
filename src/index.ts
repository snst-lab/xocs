import { Core } from "@modules/core";
import * as types from "@types";
import {
  iConfig,
  iTask,
  iThread,
  iWatcher,
  iBrowser,
  iRemote,
  iProcessor,
} from "@interfaces/index";

/**
 * @dev Types
 */
export type Path = types.Path;
export type Options = types.Options;
export type WatchOption = types.WatchOption;
export type BrowserOption = types.BrowserOption;
export type RemoteOption = types.RemoteOption;
export type CopyOption = types.CopyOption;
export type SassOption = types.SassOption;
export type PostCssOption = types.PostCssOption;
export type ImageMinOption = types.ImageMinOption;

/**
 * @dev Interfaces
 */
export type Config = iConfig;
export type Task = iTask;
export type Thread = iThread;
export type Watcher = iWatcher;
export type Browser = iBrowser;
export type Remote = iRemote;
export type Processor = iProcessor;

/**
 * @dev Core instance
 */
const core: Core = new Core();
export { core as default, core as xocs };
