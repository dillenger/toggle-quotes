function handleClick() {
  browser.toggleQuotesApi.toggleQuotes();
};

browser.browserAction.onClicked.addListener(handleClick);

browser.toggleQuotesApi.loadButton();
