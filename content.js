chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "getToken") {
      let key = null;

      switch (window.location.hostname) {
        case 'publisher.adthrive.com':
          key = 'token';
          break;
        case 'admin.adthrive.com':
          key = 'ipToken';
          break;
        default:
          break;
      }

      if (key !== null) {
        let token = window.localStorage.getItem(key);
        chrome.runtime.sendMessage({ message: 'got_token', data: token });
      }
    }
  }
);