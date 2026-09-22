const isColorSupported = !process.env.NO_COLOR && (process.stdout.isTTY || process.env.FORCE_COLOR);

function c(open, close) {
  return (str) => (isColorSupported ? `${open}${str}${close}` : String(str));
}

export const colors = {
  reset: c('\x1b[0m', '\x1b[0m'),
  bold: c('\x1b[1m', '\x1b[22m'),
  dim: c('\x1b[2m', '\x1b[22m'),
  italic: c('\x1b[3m', '\x1b[23m'),
  underline: c('\x1b[4m', '\x1b[24m'),
  red: c('\x1b[31m', '\x1b[39m'),
  green: c('\x1b[32m', '\x1b[39m'),
  yellow: c('\x1b[33m', '\x1b[39m'),
  blue: c('\x1b[34m', '\x1b[39m'),
  magenta: c('\x1b[35m', '\x1b[39m'),
  cyan: c('\x1b[36m', '\x1b[39m'),
  white: c('\x1b[37m', '\x1b[39m'),
  gray: c('\x1b[90m', '\x1b[39m'),
  bgCyan: c('\x1b[46m', '\x1b[49m'),
  bgMagenta: c('\x1b[45m', '\x1b[49m'),
  bgBlue: c('\x1b[44m', '\x1b[49m')
};
