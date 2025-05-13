const makeStorageKey = (configName) => configName ? `ipxl_config_${configName}` : 'ipxl_cache';

export const updateConfig = (config, configName) => {
  localStorage.setItem(makeStorageKey(configName), JSON.stringify(config));
};

export const getConfig = (configName) => {
  const storeConfig = localStorage.getItem(makeStorageKey(configName));
  return JSON.parse(storeConfig);
};

export const resetConfig = (configName) => {
  localStorage.removeItem(makeStorageKey(configName));
};
