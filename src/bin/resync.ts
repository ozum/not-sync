#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * Very basic CLI without any dependency which uses default options and outputs minimal log.
 * For more advanced options, please use https://www.npmjs.com/package/not-sync-cli
 *
 * Just provide paths as CSV. Directories are created if they don't exist.
 *
 * @example
 * $ not-sync node_modules,dist,coverage
 */

import { resync, ServiceKey } from "../index";

const args = process.argv.slice(2);
const paths = (args[0] || "").split(",");

const move = (service: ServiceKey, from: string, to: string): void =>
  console.log(`[resync] [${service}] "${to}" is restored into its original path.`);

if (paths.length > 0) resync(paths, { on: { move } });
