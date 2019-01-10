/*
Author: fuzzylimes
Created: 12/27/2018
Last: 01/09/2019
*/

function writeCurrentRecordToStorage(host, recordValues, callback) {
    let dbRecord = {}
    dbRecord[host] = recordValues;
    chrome.storage.local.set(dbRecord, () => {
        callback();
    });
}

function getRecordFromStorage(host, callback) {
    chrome.storage.local.get(host, (hostObject) => {
        if (!objectIsEmpty(hostObject)) {
            currentHostnameValues = hostObject[host];
            if (currentHostnameValues.l < getCurrentDate()) {
                currentHostnameValues.l = getCurrentDate();
                currentHostnameValues.d = 0;
            }
        } else {
            currentHostnameValues = { l: getCurrentDate(), d: 0, t: 0 };
        }
        currentHostname = host;
        callback();
    });
}

function objectIsEmpty(object) {
    return Object.keys(object).length === 0;
}