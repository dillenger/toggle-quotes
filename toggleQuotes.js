browser.messageDisplayAction.onClicked.addListener((tab, info) => {
  browser.toggleQuotesApi.toggleQuotes(tab.windowId);
});

browser.messageDisplay.onMessageDisplayed.addListener((tab, message) => {
  browser.toggleQuotesApi.loadButton(tab.windowId);
});

browser.toggleQuotesApi.loadButton();
