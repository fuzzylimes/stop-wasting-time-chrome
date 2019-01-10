/*
Author: fuzzylimes
Created: 12/27/2018
Last: 01/09/2019
*/

const PURPLE = '#6B459A';
const GRAY = '#777';

function turnOn() {
    updateBadge('on', PURPLE);
    reload();
}

function turnOff() {
    updateBadge('off', GRAY);
    reload();
}

function updateBadge(text, color) {
    chrome.browserAction.setBadgeText({ 'text': text });
    chrome.browserAction.setBadgeBackgroundColor({ 'color': color });
}

// Reload the current tab
function reload() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.reload(tabs[0].id);
    });
}

// Set badge on startup
updateBadge('?', GRAY);

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        chrome.storage.local.set({ 'state': false });
        turnOff();
    } else if (details.reason == "update") {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});

// Handle current state on startup
chrome.runtime.onStartup.addListener(function() {
    chrome.storage.local.get('state', (data) => {
        let state = data['state'];
        if (state) {
            turnOn();
        } else {
            turnOff();
        }
    })
})

// Handle events from popup
chrome.runtime.onMessage.addListener(function(request, sender) {
    if(request.state) {
        turnOn();
    } else {
        turnOff();
    }
});