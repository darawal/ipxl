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
import {warn} from "./log";
import {MAX_ALLOWED_EVENT_SIZE, MAX_ALLOWED_ATTRIBUTES_COUNT} from "./constant";

export function getBrowserSize() {
  const width = window.innerWidth || document.body.clientWidth;
  const height = window.innerHeight || document.body.clientHeight;

  return {
    width,
    height
  }
}

export function getTimeDiffInMinutes(time1, time2) {
  return Math.round(Math.abs((time2 - time1) / (60 * 1000)));
}

//Calculate approx memory size of javascript object
export function memorySizeOf(o) {
  var bytes = 0;

  function sizeOf(obj){
    if(obj !== null && obj !== undefined) {
      switch(typeof obj) {
        case 'number':
          bytes += 8;
          break;
        case 'string':
          bytes += obj.length * 2;
          break;
        case 'boolean':
          bytes += 4;
          break;
        case 'object':
          var objClass = Object.prototype.toString.call(obj).slice(8, -1);
          if(objClass === 'Object' || objClass === 'Array') {
            for(var key in obj) {
              if(!obj.hasOwnProperty(key)) continue;
              sizeOf(obj[key]);
            }
          } else bytes += obj.toString().length * 2;
          break;
      }
    }
    return bytes;
  }

  return sizeOf(o);
};

//Handle Error
export function handleErrors(response) {
  if (!response.ok) {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
  return response;
}

//validate event payload
export function validatePayload(eventData, storeConfig){
  let isValid = true;

  if (!storeConfig?.endpoint) {
    warn(
        'endpoint is missing, please run initialize function before sending any data',
    );
    return false;
  }

  //limit number of metrics to be sent
  if(eventData && eventData.length > MAX_ALLOWED_ATTRIBUTES_COUNT){
    warn(
        `An single event cannot have more than ${MAX_ALLOWED_ATTRIBUTES_COUNT} metrics`,
    );
    return false;
  }
  const sizeInKb = memorySizeOf(eventData);
  if(eventData && sizeInKb > MAX_ALLOWED_EVENT_SIZE){
    warn(
        `An single event cannot be of size more than ${MAX_ALLOWED_EVENT_SIZE/1000}Kb`,
    );
    return false;
  }

  return isValid;
}
