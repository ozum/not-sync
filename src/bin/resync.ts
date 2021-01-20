#!/usr/bin/env node
import meow from "meow";
import getHelp, { commonFlags, chalk } from "meow-helper";
import type { ExtendedAnyFlags } from "meow-helper";
import { resync } from "../index";
import { enableEvents, logInfo } from "./utils/events";
import pkg from "./utils/pkg";
import baseFlags from "./utils/flags";

const args = { "path...": "Path or list of paths (separate with space) to re-enable syncronization for." };
const flags: ExtendedAnyFlags = { ...baseFlags, ...commonFlags };
const description =
  "Enable synchronization for some files in cloud storage such as Dropbox, iCloudDrive or OneDrive. Detects cloud storage provider.";
const examples = chalk`resync {yellow --i .gitignore} {cyan node_modules dist coverage}`;

const help = getHelp({
  flags,
  args,
  command: "resync",
  description,
  examples,
});
const cli = meow(help, { flags, pkg, description, allowUnknownFlags: false });

logInfo(cli.flags);
resync(cli.input, { ...cli.flags, on: enableEvents });
