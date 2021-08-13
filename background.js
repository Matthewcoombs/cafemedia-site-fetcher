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
    {urls: ["*://develop.api.dev.adthrive.com/*", "*://publisher-api.development.cafemedia.com/develop/*"]},
    ["blocking"]
);


function redirectUrl(details) {
  if (window.localStorage.getItem('redirect') !== null) {
    let url = details.url;
    const redirectUrl = `publisher-api.development.cafemedia.com/${window.localStorage.getItem('apiBranch')}`;

    url = url.includes('develop.api.dev.adthrive.com') ? url.replace("develop.api.dev.adthrive.com", redirectUrl) : url.replace("publisher-api.development.cafemedia.com/develop", redirectUrl);

    return {
      redirectUrl: url
    };
  }
}
