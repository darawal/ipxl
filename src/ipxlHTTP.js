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
import { getConfig } from "./store";
import { log } from "./log";
import {
  handleSession,
  addNewUniqueIDAndTimeStamp,
  getSessionId,
} from "./session";
import { queueEvents } from "./queueData";
import { handleErrors, validatePayload } from "./utils";

export const sendData = ({ type, eventData, queueData, configName }) => {
  handleSession();
  const storeConfig = getConfig(configName);
  const sessionId = getSessionId(configName);

  if (!validatePayload(eventData, storeConfig)) {
    return;
  }

  const eventPayload = { ...eventData, sessionId };
  let payload = null;

  if (queueData && storeConfig?.queueCapacity > 0) {
    const [continueQueuing, eventData] = queueEvents(
      storeConfig,
      type,
      eventPayload
    );
    if (continueQueuing) {
      return;
    } else {
      payload = eventData;
    }
  } else {
    payload = JSON.stringify({
      type,
      events: [eventPayload],
    });
  }

  fetch(storeConfig?.endpoint, {
    headers: {
      accept: "*/*",
      "cache-control": "no-cache",
      "content-type": "application/json",
      "sec-fetch-site": "cross-site",
    },
    keepalive: true,
    body: payload,
    method: "POST",
    mode: "cors",
    credentials: "omit",
  })
    .then(handleErrors)
    .then((response) => {
      log(response);
    })
    .catch((error) => {
      log(error);
      //When evenMetadata payload is missing with sessionId
      if (error && error.status === 400 && error.statusText === "Bad Request") {
        addNewUniqueIDAndTimeStamp();
      }
    });
};

export const sendIpxlData = async ({ type, eventData, configName }) => {
  handleSession(configName);
  const storeConfig = getConfig(configName);
  const sessionId = getSessionId(configName);

  if (!validatePayload(eventData, storeConfig)) {
    return;
  }

  const payload = JSON.stringify({ type, ...eventData, sessionId });

  fetch(storeConfig?.endpoint, {
    headers: {
      accept: "*/*",
      "cache-control": "no-cache",
      "content-type": "application/json",
      "sec-fetch-site": "cross-site",
    },
    keepalive: true,
    body: payload,
    method: "POST",
    mode: "cors",
    credentials: "omit",
  })
    .then(handleErrors)
    .then((response) => {
      log(response);
    })
    .catch((error) => {
      log(error);
      //When evenMetadata payload is missing with sessionId
      if (error && error.status === 400 && error.statusText === "Bad Request") {
        addNewUniqueIDAndTimeStamp(configName);
      }
    });
};
