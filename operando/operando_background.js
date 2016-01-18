var webRequest = chrome.webRequest;
var Prefs = require("prefs").Prefs;

chrome.contentSettings['location'].set({
    'primaryPattern': '<all_urls>',
    'setting': 'block',
    'scope': 'regular'
});

webRequest.onBeforeRequest.addListener(
    function (details) {

        if (Prefs.accept_unsecured_submits == false) {

            if (details.method === "POST" && details.url.indexOf("https://") != 0) {
                Prefs.unsecured_submits++;
                return {cancel: true}
            }
        }

        if (Prefs.follow_unsecured_links == false) {
            if (details.url.indexOf("http://") != 0) {
                Prefs.unsecured_links_followed++;
                //return {cancel: true}
            }
        }

    },
    {urls: ["<all_urls>"]},
    ["blocking"]
);


var HEADERS_TO_STRIP_LOWERCASE = [
    'content-security-policy',
    'x-frame-options',
];

webRequest.onHeadersReceived.addListener(
    function (details) {
        return {
            responseHeaders: details.responseHeaders.filter(function (header) {
                return HEADERS_TO_STRIP_LOWERCASE.indexOf(header.name.toLowerCase()) < 0;
            })
        };
    }, {
        urls: ["<all_urls>"]
    }, ["blocking", "responseHeaders"]);


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    if (message.message === "getCookies") {
        if (message.url) {
            chrome.cookies.getAll({url: message.url}, function (cookies) {
                sendResponse(cookies);
            });

            return true;
        }
    }

});



chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {

        var referer = "";
        for (var i = 0; i < details.requestHeaders.length; ++i) {
            var header = details.requestHeaders[i];
            if (header.name === "X-Alt-Referer") {
                referer = header.value;
                details.requestHeaders.splice(i, 1);
                break;
            }
        }
        if (referer !== "") {
            for (var i = 0; i < details.requestHeaders.length; ++i) {
                var header = details.requestHeaders[i];
                if (header.name === "Referer") {
                    details.requestHeaders[i].value = referer;
                    break;
                }
            }
        }
        console.log(details.requestHeaders);

        return {requestHeaders: details.requestHeaders};

    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]);

