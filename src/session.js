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
import { v4 as uuidv4 } from "uuid";
import { validate as uuidValidate } from "uuid";
import { getBrowserSize, getTimeDiffInMinutes } from "./utils";
import { sendData } from "./ipxlHTTP";
import { UAParser } from "ua-parser-js";
import { sendIpxl } from "./core";
import { getConfig } from "./store";

function sendEventMetaData() {
  const { width, height } = getBrowserSize() || { width: 0, height: 0 };

  sendData({
    type: "eventMetadata",
    eventData: {
      browserWidth: width,
      browserHeight: height,
      cookieEnabled: window?.navigator?.cookieEnabled || false,
      userAgent: window.navigator.userAgent,
    },
    queueData: false,
  });
}

function validateSession(configName) {
  let uid = getSessionId(configName);
  let ts = getSessionTimestamp(configName);

  const currentTimestamp = Date.now();
  const idleTimeInMinutes = getTimeDiffInMinutes(ts, currentTimestamp);
  const config = getConfig(configName);
  const validity = config.sessionTtlMinutes ?? 60;
  return !uid || !uuidValidate(uid) || !ts || idleTimeInMinutes > validity;
}

/**
 * Converts a UA parser device type to our type.
 *
 * We have only PC, Mobile, and Tablet as device types but the parser provides finer ones.
 * See https://www.npmjs.com/package/ua-parser-js
 * See also https://github.com/faisalman/ua-parser-js/issues/182
 *
 * @param {string} sourceType - Type provided by the parser
 * @returns {string} Converted type
 */
function resolveDeviceType(sourceType) {
  switch (sourceType) {
    case "wearable":
    case "mobile":
      return "Mobile";
    case "tablet":
    case "smarttv":
      return "Tablet";
    default:
      return "PC";
  }
}

// Public Functions ///////////////////////////////////////////////////////

export async function addNewUniqueIDAndTimeStamp(configName) {
  const config = getConfig(configName);
  if (!config?.useConventionalStartSessionEvent) {
    const isExpired = validateSession(configName);
    if (isExpired) {
      renewSession(configName);
      await notifySessionCreation(configName);
    }
  } else {
    renewSession(configName);
    // Send session information once  anew session is created
    sendEventMetaData();
  }
}

export function getSessionId(configName) {
  const key = configName ? `ipxl_session_id_${configName}` : "ipxl_event_uid";
  return localStorage.getItem(key);
}

export function getSessionTimestamp(configName) {
  const key = configName ? `ipxl_session_ts_${configName}` : "ipxl_event_ts";
  return localStorage.getItem(key);
}

export function renewSession(configName) {
  const keyId = configName ? `ipxl_session_id_${configName}` : "ipxl_event_uid";
  const keyTs = configName ? `ipxl_session_ts_${configName}` : "ipxl_event_ts";
  localStorage.setItem(keyId, uuidv4());
  localStorage.setItem(keyTs, Date.now());
}

export function clearSession(configName) {
  const keyId = configName ? `ipxl_session_id_${configName}` : "ipxl_event_uid";
  const keyTs = configName ? `ipxl_session_ts_${configName}` : "ipxl_event_ts";
  localStorage.removeItem(keyId);
  localStorage.removeItem(keyTs);
}

export function handleSession(configName) {
  const isExpired = validateSession(configName);
  if (isExpired) {
    addNewUniqueIDAndTimeStamp(configName);
  }
}

export async function notifySessionCreation(configName) {
  const userAgent = navigator?.userAgent ?? "";
  const parser = new UAParser(userAgent);
  const parsedUA = parser.getResult();
  const deviceType = resolveDeviceType(parsedUA?.device?.type);
  const startedAt = getSessionTimestamp(configName);
  return sendIpxl(
    {
      type: "sessionStarted",
      browserWidth: window?.screen?.width,
      browserHeight: window?.screen?.height,
      userAgent,
      browserName: parsedUA?.browser?.name,
      browserVersion: parsedUA?.browser?.version,
      deviceName: parsedUA?.device?.vendor,
      deviceVersion: parsedUA?.device?.model,
      osName: parsedUA?.os?.name,
      osVersion: parsedUA?.os?.version,
      deviceType,
      startedAt,
    },
    configName
  );
}
