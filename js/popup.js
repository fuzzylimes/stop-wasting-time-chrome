/*
    Author: fuzzylimes
    Created: 12/27/2018
    Last: 12/27/2018
*/

let enable = document.getElementById('enable');
let disable = document.getElementById('disable');
let state = document.getElementById('state');
let options = document.getElementById('options');

chrome.storage.local.get('state', function (data) {
    let currentState = data['state'];
    currentState ? state.innerHTML = "enabled." : state.innerHTML = "disabled.";
});

function changeState(state) {
    chrome.storage.local.set({ 'state': state }, function () {
        chrome.runtime.sendMessage({ state: state });
        window.close();
    });
}

enable.onclick = function () {
    changeState(true);
};

disable.onclick = function () {
    changeState(false);
};

options.onclick = function () {
    chrome.runtime.openOptionsPage();
}
