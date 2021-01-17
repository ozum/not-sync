/**
 * Return difference of two array.
 *
 * @param arrayA is the array to subtract elements from.
 * @param arrayB is the array of elements to subtract.
 * @returns difference of the arrays.
 */
export function difference<T>(arrayA: T[], arrayB: any[]): T[] {
  return arrayA.filter((x) => !arrayB.includes(x));
}

/**
 * Assures output is an array by converting sets and single valiues into array.
 *
 * @param input is the input.
 * @returns the array.
 */
export function arrify<T>(input: T | T[] | Set<T>): T[] {
  if (Array.isArray(input)) return input;
  return input instanceof Set ? [...input] : [input];
}

/**
 * Detects first EOL characters used in given string.
 *
 * @param str is to detect EOL from.
 * @param fallback is the default EOL to be used if none found.
 * @returns EOL characters.
 */
export function detectEOL(str: string, fallback = "\n"): string {
  const index = str.indexOf("\n");
  if (index === -1) return str.indexOf("\r") >= 0 ? "\r" : fallback;
  return str[index - 1] === "\r" ? "\r\n" : "\n";
}
