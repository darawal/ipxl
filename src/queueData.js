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