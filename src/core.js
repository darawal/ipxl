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
import { warn, error } from "./log";
import { defaultConfig, exceptionTypeEnum } from "./constant";
import { sendData, sendIpxlData } from "./ipxlHTTP";
import { updateConfig, resetConfig } from "./store";
import { getSessionTimestamp, addNewUniqueIDAndTimeStamp } from "./session";

//Public Functions
export function initialize(config, configName) {
  if (!config.hasOwnProperty("endpoint")) {
    warn("endpoint is required in initialize()");
    return;
  }

  // Reset store config
  resetConfig(configName);

  // Get final config and save it
  const configToStore = {
    endpoint: config.endpoint,
    configName,
    ...defaultConfig,
    ...(config.options ?? {}),
  };

  updateConfig(configToStore, configName);

  if (!configToStore.lazySessionInitialization) {
    addNewUniqueIDAndTimeStamp(configName);
  }
}

export function userClicks(data, configName) {
  const { pageURL, pageTitle, pageDomain, eventLabel, ...rest } = data || {};

  if (!pageURL) {
    error("pageURL is required params");
    return;
  }
  if (!pageTitle) {
    error("pageTitle is required params");
    return;
  }
  if (!pageDomain) {
    error("pageDomain is required params");
    return;
  }
  if (!eventLabel) {
    error("eventLabel is required params");
    return;
  }

  sendData({
    type: "clickEvent",
    eventData: {
      pageDomain: pageDomain,
      pageURL,
      pageTitle,
      referrer: document?.referrer,
      timestamp: getSessionTimestamp(),
      eventLabel,
      ...rest,
    },
    queueData: true,
    configName,
  });
}

export function userException(data) {
  const { pageURL, pageTitle, pageDomain, exceptionType, errorText, ...rest } =
    data || {};

  if (!pageURL) {
    warn("path is required params");
    return;
  }
  if (!pageTitle) {
    error("pageTitle is required params");
    return;
  }
  if (!pageDomain) {
    error("pageDomain is required params");
    return;
  }
  if (!exceptionType) {
    error("exceptionType is required params");
    return;
  }
  if (!exceptionTypeEnum.includes(exceptionType)) {
    error("exceptionType value does not exist in defined ENUM");
    return;
  }
  if (!errorText) {
    error("errorText is required params");
    return;
  }

  sendData({
    type: "exception",
    eventData: {
      pageDomain: pageDomain,
      pageURL,
      pageTitle,
      referrer: document?.referrer,
      timestamp: getSessionTimestamp(),
      exceptionType,
      errorText,
      ...rest,
    },
    queueData: false,
  });
}

export async function sendIpxl(data, configName) {
  const { type, ...rest } = data || {};

  if (!type) {
    error("type is required params");
    return;
  }
  await sendIpxlData({
    type,
    eventData: rest,
    queueData: true,
    configName,
  });
}
