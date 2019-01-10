/*
Author: fuzzylimes
Created: 12/27/2018
Last: 01/09/2019
*/

function handlePageUpdate(tabId, changeInfo, tab) {
    var changeStatus = changeInfo.status;

    if (changeStatus === 'complete') {
        if (isTabUndefined(tab)) {
            handleUndefinedTab();
        } else {
            handleDefinedTab(tab);
        }
    }
}

function isTabUndefined(tab) {
    return typeof tab === 'undefined';
}

function handleUndefinedTab() {
    if (currentHostname != null) {
        stopTimer();
        saveCurrentHostnameData(function() {
            resetHostname();
            timeOnPage = 0;
        });
    } else {
        resetHostname();
    }
}

function saveCurrentHostnameData(callback) {
    var lastDate = currentHostnameValues.l;
    var today = getCurrentDate();

    currentHostnameValues.l = today;
    lastDate < today ? currentHostnameValues.d = timeOnPage : currentHostnameValues.d += timeOnPage;
    currentHostnameValues.t += timeOnPage;

    writeCurrentRecordToStorage(currentHostname, currentHostnameValues, callback);
}

function resetHostname() {
    currentHostname = null;
    console.log("Active hostname has changed to " + currentHostname);
}

function handleDefinedTab(tab) {
    var hostname = getUrl(tab.url);
    console.log(hostname);
    if (matchesCurrentHostname(hostname) && currentHostnameValues.l < getCurrentDate()) {
        handleTimerReset(hostname);
    } else {
        checkForTimerRest(hostname);
    }
}

function matchesCurrentHostname(hostname) {
    return hostname === currentHostname;
}

function checkForTimerRest(hostname) {
    if (!matchesCurrentHostname(null)) {
        handleTimerReset(hostname);
    } else {
        console.log("No previous record found");
        getRecordFromStorage(hostname, startTimer);
    }
}

function handleTimerReset(hostname) {
    try {
        stopTimer();
        saveCurrentHostnameData(function () {
            timeOnPage = 0;
            getRecordFromStorage(hostname, startTimer);
        })
    } catch (e) {
        console.log("No timer running");
        getRecordFromStorage(hostname, startTimer);
    }
}

function startTimer() {
    counterProcessId = setInterval(() => {
        timeOnPage += 1;
        updateBadge(formatBadgeValue(timeOnPage + currentHostnameValues.d), PURPLE);
    }, (UPDATE_TIME_IN_MS));
}

function stopTimer() {
    clearInterval(counterProcessId);
}
