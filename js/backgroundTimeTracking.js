let activeTabId = 0;
let timeOnPage = 0;
let counterProcessId = 0;
let currentHostname = null;

const UPDATE_TIME_IN_MS = 1000;

let currentHostnameValues = null;

// function handleUpdate(tabId, changeInfo, tab) {

//     console.log(changeInfo);
//     if (changeInfo['status'] === 'complete') {
//         console.log(JSON.stringify(tab));
//         if (typeof tab !== 'undefined') {
//             var hostname = getUrl(tab.url);
//             console.log(hostname + "!");
    
//             console.log(currentHostname)
//             if (matchesCurrentHostname(hostname)) {
//                 console.log("Active hostname remains the same " + hostname);
//             } else {
//                 try  {
//                     stopTimer();
//                     timeOnPage = 0;
//                 } catch(e) {
//                     console.log("No timer running");
//                 }
//                 startTimer();
//                 currentHostname = hostname;
//             }
//         } else {
//             currentHostname = null;
//             console.log("Active hostname has changed to " + currentHostname);
//         }

//     }
// }

// function getRecordsFromStorage(record, callback) {
//     chrome.storage.local.get('hostnames', (hosts) => {
//         if (hosts.hostnames.hasOwnProperty(record)) {
//             callback(hosts.hostnames[record]);
//         } else {
//             var newHost = {}
//             var lastUpdate = new Date();
//             newHost[record] = {l: lastUpdate, d: 0, t: 0}
//             callback(newHost)
//         }
//     });
// }

// function startTimer() {
//     counterProcessId = setInterval(() => {
//         timeOnPage += 1;
//         // chrome.runtime.sendMessage({ updateBadge: true, value: timeOnPage });
//         updateBadge(formatBadgeValue(timeOnPage), PURPLE);
//     }, (UPDATE_TIME_IN_MS));
// }

// function stopTimer() {
//     clearInterval(counterProcessId);
// }

function handleStateChange(newState) {
    // TODO: add logic for state changes idle, locked, active
}

function activeTab(activeInfo) {
    var newTabId = activeInfo['tabId'];
    console.log(activeTabId + " is no longer active.")
    console.log("Active tab is now " + newTabId);
    activeTabId = newTabId;

    // var tabInfo = getTab(newTabId);

    getTabForUpdate(newTabId);
    // handleUpdate(newTabId, {'status': 'complete'}, tabInfo);
}

function doesHostnameExist(hostName) {
    chrome.storage.local.get('hostnames', (hostnames) => {
        currentHostnameValues = hostnames;
        return hostnames.hostnames.hasOwnProperty(hostName);
    });
}

function getTabForUpdate(tabId) {
    chrome.tabs.get(tabId, (tab) => {
        handlePageUpdate(tabId, {'status': 'complete'}, tab);
    });
}

function getTabUrl(tab) {
    getUrl(tab.url);
}

function getUrl(url) {
    console.log("asdf: " + url)
    return (new URL(url)).hostname;
}

// function matchesCurrentHostname(hostname) {
//     return currentHostname === hostname;
// }



chrome.tabs.onUpdated.addListener(handlePageUpdate);
chrome.tabs.onActivated.addListener(activeTab);
chrome.idle.onStateChanged.addListener(handleStateChange);
// chrome.windows.onRemoved.addListener
// chrome.tabs.onRemoved.addListener(HandleRemove);
// chrome.tabs.onReplaced.addListener(HandleReplace);