import * as utils from './utils.mjs'

// Register an onMessage listener to let the content script talk to us.
// This listener MUST NEVER be an async function. The listener must ALWAYS
// return a Promise, or false. Check documentation on MDN for more details.
browser.runtime.onMessage.addListener((message, sender) => {
  switch (message?.command) {
    case "getQuotesCollapsed":
      return utils.getQuotesCollapsed(sender.tab.id);
    case "toggleQuotes":
      return utils.toggleQuotes(sender.tab.id);
  }
  // The received message was not for, us. Return false to let other listeners
  // get a chance to evaluate the message.
  return false;
})

// Register a listener to load the content script into any newly opened message.
browser.messageDisplayScripts.register({
  js: [{ file: "/toggle_quotes.js" }]
});

// Loop over all already open message tabs and manually inject our content script.
for (let tab of await browser.tabs.query({ type: ["mail", "messageDisplay"] })) {
  // Is the tab displaying a message?
  let message = await browser.messageDisplay.getDisplayedMessage(tab.id);
  if (!message) {
    continue;
  }
  // Is our content script already loaded? Can happen if the add-on was disabled
  // and re-enabled.
  let loaded = await utils.checkIfLoaded(tab.id);
  if (loaded) {
    continue;
  }
  messenger.tabs.executeScript(tab.id, {
    file: "/toggle_quotes.js"
  });
}

// Register a listener for the message display action, to toggle the quotes.
browser.messageDisplayAction.onClicked.addListener(async (tab, info) => {
  await utils.toggleQuotes(tab.id);
});
