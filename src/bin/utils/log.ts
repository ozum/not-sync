import { EOL } from "os";
import { chalk, cliui } from "meow-helper";

const { dim, blue } = chalk;

const isSupported = process.platform !== "win32" || process.env.CI || process.env.TERM === "xterm-256color";
const main = { info: "ℹ", success: "✔", warning: "⚠", error: "✖" };
const fallbacks = { info: "i", success: "√", warning: "‼", error: "×" };
const colors = { info: chalk.blue, success: chalk.green, warning: chalk.yellow, error: chalk.red };
const symbols = isSupported ? main : fallbacks;

function getLabel(type: keyof typeof main): string {
  const space = " ".repeat(7 - type.length);
  const label = `${symbols[type]} ${type}${space}`;
  return colors[type](label);
}

export function log(scope: string, type: "info" | "warning" | "error" | "success", message: string): void {
  const ui = cliui();
  const scopeString = scope ? `[${scope}]` : "";
  ui.div(
    { text: chalk`{dim [not-sync] ${scopeString}}`, width: 25 },
    { text: dim(" >"), width: 2 },
    { text: getLabel(type), width: 11 },
    { text: message }
  );
  console.log(ui.toString()); // eslint-disable-line no-console
}

export function formatPath(left: string, right?: string): string {
  return right ? `${blue(left)} -> ${blue(right)}` : `${blue(left)}`;
}

export function list(
  entries: string[] | Set<string>,
  symbol = "•",
  colorName: keyof typeof chalk = symbol === "✖" ? "red" : "blue"
): string {
  const color = chalk[colorName] as (name: string) => any;
  const bullet = `${EOL}${color(symbol)} `;
  return bullet + (Array.isArray(entries) ? entries : [entries]).join(bullet);
}
