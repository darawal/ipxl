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
let queuedData = [];
let lastDataSentTimestamp = null;

export function queueEvents(storeConfig, type, eventPayload){
    let continueQueuing = true;
    let payload = null;

    //Queue batching checks
    let queueIntervalPassed = false;
    if(lastDataSentTimestamp === null){
        lastDataSentTimestamp = Date.now();
    }else{
        const timeDiffInSeconds = (Date.now() - lastDataSentTimestamp)/1000;
        if(timeDiffInSeconds > storeConfig?.queueInterval){
            queueIntervalPassed = true;
        }
    }


    if(queuedData.length >= storeConfig?.queueCapacity || queueIntervalPassed){
        payload = JSON.stringify({
            type,
            events: queuedData
        });
        queuedData = [];
        lastDataSentTimestamp=null;

        continueQueuing = false;
    }else{
        queuedData.push(eventPayload);
    }

    return [continueQueuing, payload];
}