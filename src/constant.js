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
export const MAX_ALLOWED_ATTRIBUTES_COUNT = 30;
export const MAX_ALLOWED_EVENT_SIZE = 50000;

export const defaultConfig = {
  debug: false,
  queueCapacity : 20, // 20 clickEvent type events can be batched by default
  queueInterval : 60 // 1 minute is default time after which batched events will be sent to server by default
};

export const exceptionTypeEnum = [
  'ReferenceError',
  'SyntaxError',
  'TypeError',
  'NetworkError',
  'RangeError',
  'URIError',
  'InternalError',
];
