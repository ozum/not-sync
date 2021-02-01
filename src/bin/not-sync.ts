#!/usr/bin/env node

/**
 * Very basic CLI without any dependency which uses default options and outputs minimal log.
 * For more advanced options, please use https://www.npmjs.com/package/not-sync-cli
 *
 * Just provide paths as CSV. Directories are created if they don't exist.
 *
 * @example
 * $ not-sync node_modules,dist,coverage
 */

import { notSync, ServiceKey } from "../index";

const args = process.argv.slice(2);
const paths = args[0].split(",");

const symlink = (service: ServiceKey, target: string, path: string): void =>
  console.log(`[not-sync] [${service}] "${path}" is moved to "${target}" and added a symbolic link.`); // eslint-disable-line no-console

notSync(paths, { createDirs: true, on: { symlink } });
