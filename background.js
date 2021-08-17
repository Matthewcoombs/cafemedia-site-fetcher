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


chrome.tabs.onUpdated.addListener(function (_tabId, changeInfo, _tab) {
  if (changeInfo.status == 'complete') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { message: "getToken" }, function (response) { });
        chrome.tabs.sendMessage(tabs[0].id, { message: "checkTabInstance" }, function (response) { });
      }
    });
  }
  return true;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'redirect') {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [{
        id: 5,
        priority: 1,
        action: {
          type: "redirect",
          redirect: {
            regexSubstitution: request.data
          }
        },
        condition: {
          regexFilter: "/publisher-api.development.cafemedia.com/develop/",
          resourceTypes: [
            "xmlhttprequest"
          ]
        }
      }],
    })
  }
  else if (request.message === 'disable-redirect') {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [5],
    })
  }
})

