/*
    Author: fuzzylimes
    Created: 12/27/2018
    Last: 12/27/2018
*/

let clear = document.getElementById("clearRules");
let save = document.getElementById("saveRules");
let remove = document.getElementsByClassName("delete");
let add = document.getElementById("addRule");
let cancel = document.getElementById("cancel");

// On options screen load, data fill existing rules
chrome.storage.local.get('rules', function (data) {
    let savedRules = data['rules'];
    let i = 1;
    for (let key in savedRules) {
        if (i > 1) {
            buildFields();
        } else {
            createEventListeners(remove[0]);
        }
        let rules = savedRules[key];
        document.getElementById('string' + i).value = rules.join("|");
        document.getElementById('replace' + i).value = key;
        i += 1;
    }
});

// Handle deleting all rules button click
clear.addEventListener('click', function() {
    if (confirm('Warning: This will permanently delete all of your saved filters.\nDo you wish to continue?')) {
        chrome.storage.local.set({ state: false, rules: {} });
        chrome.runtime.sendMessage({ state: false });
        location.reload();
    } else {
        // Do nothing!
    }
})

// Handle Apply/Save button click
save.addEventListener('click', function() {
    let objectResponse = {};

    let rules = document.getElementsByClassName('rule');
    for (var rule of rules) {
        var elements = getStringsReplace(rule);
        let stringArray = elements.string.value.split('|');
        let set = new Set(stringArray);
        objectResponse[elements.replace.value] = [...set];
    }

    chrome.storage.local.set({state: true, rules: objectResponse});
    chrome.runtime.sendMessage({ state: true });
    location.reload();
})

// Handle adding a new filter to options screen
add.addEventListener('click', function() {
    buildFields();
})

// Handle cancel changes
cancel.addEventListener('click', function() {
    location.reload();
})

// Builds the new filter and adds it to the DOM
function buildFields() {
    let rules = document.getElementsByClassName('rule');
    let rule = rules[0];
    var container = document.getElementsByClassName('container')[0];
    var newRule = rule.cloneNode(true);

    var elements = getStringsReplace(newRule);

    elements.string.id = 'string' + (rules.length + 1);
    elements.replace.id = 'replace' + (rules.length +1);
    clearFields(elements)

    container.appendChild(newRule);
    createEventListeners(newRule.getElementsByClassName('delete')[0]);
}

// Finds the strings and replace classes inside the current element.
// Returns object with reference to both locations.
function getStringsReplace(element) {
    var string = element.getElementsByClassName('strings')[0];
    var replace = element.getElementsByClassName('replace')[0];
    return {string: string, replace: replace}
}

// Set the field values to null
function clearFields(elements) {
    elements.string.value = '';
    elements.replace.value = '';
}

// Creates the event listener for the rule specific delete buttons
function createEventListeners(button) {
    button.addEventListener('click', function (element) {
        let rules = document.getElementsByClassName('rule');
        var parentRule = element.currentTarget.parentNode.parentNode;

        if (rules.length === 1) {
            var elements = getStringsReplace(rules[0]);
            clearFields(elements);
        } else {
            parentRule.remove();
        }
    })
}