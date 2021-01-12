chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {urlContains: ''},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
   if (changeInfo.status == 'complete') {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, { message: "getToken" }, function (response) { });
        chrome.tabs.sendMessage(tabs[0].id, {message: "checkTabInstance"}, function(response) {});
      });
   }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'got_token') {
    window.localStorage.setItem("token", request.data);
  }
});

chrome.webRequest.onHeadersReceived.addListener(
    redirectUrl,
    {urls: ["*://develop.api.dev.adthrive.com/*"]},
    ["blocking", "responseHeaders"]
);


function redirectUrl(details) {
  if (window.localStorage.getItem('redirect') !== null) {
    let url = details.url;
    url = url.replace("develop.api.dev.adthrive.com", `${window.localStorage.getItem('apiBranch')}.api.dev.adthrive.com`);
    return {
      redirectUrl: url
    };
  }
}