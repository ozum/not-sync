const ERROR_MESSAGES = {
  NOROOT: "Root cannot be found for cloud service.",
  NOTCOMP: (path: string) => `Both original and destination exists, but original file is not a symbolic link: ${path}`,
  NOTFOUND: (path: string) => `File not found: ${path}`,
  NOTALINK: (path: string) => `File is not a link: ${path}`,
  NOTARGET: (path: string, target: string) => `Link target cannot be found: ${path} -> ${target}`,
};

type TemplateCode = keyof typeof ERROR_MESSAGES;
type TemplateFunction = (...args: any[]) => any;
type Template<T extends TemplateCode> = typeof ERROR_MESSAGES[T];
type TemplateParameters<T extends TemplateCode> = Template<T> extends TemplateFunction ? Parameters<Template<T>> : never;

/**
 * Error class with code attribute.
 * Also adds code to message as a prefix similar to node.js native error messages
 */
export default class SyncError<T extends TemplateCode> extends Error {
  public code?: string;
  public args?: Record<string, any>;

  public constructor(code: T, ...messageArgs: TemplateParameters<T>) {
    const messageTemplate = ERROR_MESSAGES[code];
    const message = typeof messageTemplate === "function" ? (messageTemplate as TemplateFunction)(messageArgs) : messageTemplate;
    super(`${code}: ${message}`);
    this.code = code;
    this.args = messageArgs;
  }
}
