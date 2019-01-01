let activeTabId = 0;
let timeOnPage = 0;
let currentHostname = null;

let currentHostnameValues = null;


function handleUpdate(tabId, changeInfo, tab) {
    // console.log(tabId);
    // console.log(changeInfo);
    // console.log(tab);

    if (changeInfo['status'] === 'complete') {
        if (typeof tab !== 'undefined') {
            var hostname = getUrl(tab.url);
            console.log(hostname + "!");
    
            if (hostname !== currentHostname) {
                console.log("Active hostname has changed to " + hostname);
                currentHostname = hostname;
            }
        } else {
            currentHostname = null;
            console.log("Active hostname has changed to " + currentHostname);
        }

    }
}

function handleStateChange(newState) {
    console.log(newState);
}

// function activeTab(activeInfo) {
//     var newTabId = activeInfo['tabId'];
//     console.log(activeTabId + " is no longer active.")
//     console.log("Active tab is now " + newTabId);
//     activeTabId = newTabId;

//     var newTabUrl = getTabUrl(newTabId);
//     console.log("TabUrl: " + newTabUrl);
// }

function activeTab(activeInfo) {
    var newTabId = activeInfo['tabId'];
    console.log(activeTabId + " is no longer active.")
    console.log("Active tab is now " + newTabId);
    // activeTabId = newTabId;

    // var newTabUrl = getTabUrl(newTabId);
    // console.log("TabUrl: " + newTabUrl);

    handleUpdate(newTabId, {'status': 'complete'}, getTab(newTabId));
}

function doesHostnameExist(hostName) {
    chrome.storage.local.get('domains', (domains) => {
        currentHostnameValues = domains;
        return domains.domains.hasOwnProperty(hostName);
    });
}

function getTab(tabId) {
    chrome.tabs.get(tabId, (tab) => {
        console.log("new tab info " + tab);
        return tab;
    });
}

function getTabUrl(tab) {
    getUrl(tab.url);
}

function getUrl(url) {
    console.log("asdf: " + url)
    return (new URL(url)).hostname;
}

function matchesCurrentHostname(hostname) {
    return 
}



chrome.tabs.onUpdated.addListener(handleUpdate);
chrome.tabs.onActivated.addListener(activeTab);
chrome.idle.onStateChanged.addListener(handleStateChange);
// chrome.tabs.onRemoved.addListener(HandleRemove);
// chrome.tabs.onReplaced.addListener(HandleReplace);