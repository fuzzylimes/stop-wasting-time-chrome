/*
Author: fuzzylimes
Created: 12/27/2018
Last: 01/09/2019
*/

let activeTabId = 0;
let timeOnPage = 0;
let counterProcessId = 0;
let currentHostname = null;

const UPDATE_TIME_IN_MS = 1000;

let currentHostnameValues = null;

// This is so ugly... barf
function handleStateChange(newState) {
    console.log(newState);
    switch (newState) {
        case "idle":
        case "locked":
        case -1:
            if (currentHostname != null) {
                try {
                    stopTimer();
                    saveCurrentHostnameData(function () {
                        timeOnPage = 0;
                        currentHostname = null;
                    });
                } catch(e) {
                    console.log(e);
                }
            }
            break;
        default:
            chrome.windows.getCurrent((window) => {
                if (window.id > -1) {
                    chrome.tabs.getAllInWindow(window.id, (tabs) => {
                        tabs.forEach(tab => {
                            if (tab.active) {ß
                                getTabForUpdate(tab.id);
                            }
                        });
                    })
                }
            })
    }
}

function activeTab(activeInfo) {
    getActiveTab(activeInfo.tabId)
}

function getActiveTab(newTabId) {
    // var newTabId = activeInfo['tabId'];
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

chrome.tabs.onUpdated.addListener(handlePageUpdate);
chrome.tabs.onActivated.addListener(activeTab);
chrome.idle.onStateChanged.addListener(handleStateChange);
chrome.windows.onFocusChanged.addListener(function(windowId) {
    handleStateChange(windowId);
})
// chrome.windows.onRemoved.addListener
// chrome.tabs.onRemoved.addListener(HandleRemove);
// chrome.tabs.onReplaced.addListener(HandleReplace);