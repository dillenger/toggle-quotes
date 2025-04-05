browser.messageDisplayAction.onClicked.addListener((tab, info) => {
  messenger.tabs.executeScript(tab.id, {
    code: `toggleQuotes();`
  })
});


browser.messageDisplay.onMessageDisplayed.addListener((tab, message) => {
  messenger.tabs.executeScript(tab.id, {
    file: "/toggle_quotes.js"
  });
});
