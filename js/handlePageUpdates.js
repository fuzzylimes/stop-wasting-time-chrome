// On an update we need to
//
// 1. check to see if the hostname has changed
// 1a. save off the existing hostname
// 1b. pull down the new host name



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
        saveCurrentHostnameData(resetHostname);
    } else {
        resetHostname();
    }
}

function resetHostname() {
    currentHostname = null;
    console.log("Active hostname has changed to " + currentHostname);
}

function saveCurrentHostnameData(callback) {
    var lastDate = currentHostnameValues.l;
    var today = getCurrentDate();

    currentHostnameValues.l = today;
    lastDate < today ? currentHostnameValues.d = timeOnPage : currentHostnameValues.d += timeOnPage;
    // currentHostnameValues.d = timeOnPage;
    currentHostnameValues.t += timeOnPage;

    chrome.storage.local.get(null, (data) => {
        data.hostnames[currentHostname] = currentHostnameValues;
        chrome.storage.local.set(data, callback());
    });

    // var updateObject = {'hostnames': {}};
    // updateObject.hostnames[currentHostname] = currentHostnameValues;

    // chrome.storage.local.set(updateObject, callback());
}

function handleDefinedTab(tab) {
    var hostname = getUrl(tab.url);
    if (matchesCurrentHostname(hostname)) {
        // Do nothing
    } else {
        manageTimer(hostname);
    }
}

function matchesCurrentHostname(hostname) {
    return hostname === currentHostname;
}

function manageTimer(hostname) {
    if (!matchesCurrentHostname(null)) {
        try {
            stopTimer();
            saveCurrentHostnameData(function() {
                timeOnPage = 0;
                getRecordsFromStorage(hostname, startTimer);
                // startController(hostname);
            })
        } catch (e) {
            console.log("No timer running");
            getRecordsFromStorage(hostname, startTimer);
        }
    } else {
        console.log("No previous record found");
        getRecordsFromStorage(hostname, startTimer);
    }
}

// function startController(hostname) {
//     startTimer();
//     currentHostname = hostname;
// }

function startTimer() {
    counterProcessId = setInterval(() => {
        timeOnPage += 1;
        updateBadge(formatBadgeValue(timeOnPage + currentHostnameValues.d), PURPLE);
    }, (UPDATE_TIME_IN_MS));
}

function stopTimer() {
    clearInterval(counterProcessId);
}

function getRecordsFromStorage(record, callback) {
    chrome.storage.local.get('hostnames', (hosts) => {
        console.log(hosts);
        if (hosts.hostnames.hasOwnProperty(record)) {
            console.log("\nrecord found!\n")
            currentHostnameValues = hosts.hostnames[record]
            if (currentHostnameValues.l < getCurrentDate()) {
                currentHostnameValues.l = getCurrentDate();
                currentHostnameValues.d = 0;
            }
            console.log(currentHostnameValues);
        } else {
            console.log("\nrecord not found!\n");
            // var newHost = {}
            // newHost[record] = { l: getCurrentDate(), d: 0, t: 0 }
            currentHostnameValues = { l: getCurrentDate(), d: 0, t: 0 };
            console.log(currentHostnameValues);
        }
        // timeOnPage = currentHostnameValues.d;
        console.log(timeOnPage);
        currentHostname = record;
        callback();
    });
}