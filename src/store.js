/*
 * Copyright (C) 2025 Isima, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
