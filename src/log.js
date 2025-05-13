import { getConfig } from './store';

export const error = (...args) => {
  const globalConfig = getConfig();
  if (globalConfig?.debug) {
    console.error(...args);
  }
};

export const warn = (...args) => {
  const globalConfig = getConfig();
  if (globalConfig?.debug) {
    console.warn(args);
  }
};

export const log = (...args) => {
  const globalConfig = getConfig();
  if (globalConfig?.debug) {
    console.log(args);
  }
};
