#!/usr/bin/env node
import meow from "meow";
import getHelp, { commonFlags, chalk } from "meow-helper";
import type { ExtendedAnyFlags } from "meow-helper";
import { notSync } from "../index";
import { disableEvents, logInfo } from "./utils/events";
import pkg from "./utils/pkg";
import baseFlags from "./utils/flags";

const args = { "path...": "Path or list of paths (separate with space) to disable syncronization for." };
const flags: ExtendedAnyFlags = {
  ...baseFlags,
  linkSameDir: {
    alias: "l",
    type: "boolean",
    default: true,
    desc: "Move files near original file for iCloudDrive. For example 'dist' is moved 'dist.nosync' in same directory.",
  },
  ...commonFlags,
};
const examples = chalk`not-sync {yellow --i .gitignore} {cyan node_modules dist coverage}`;
const help = getHelp({ flags, args, pkg, examples });
const cli = meow(help, { flags, pkg, allowUnknownFlags: false });

logInfo(cli.flags);
notSync(cli.input, { ...cli.flags, on: disableEvents });
