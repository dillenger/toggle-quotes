async function getQuotesCollapsed(tabId) {
  return browser.storage.session
    .get({ [`quotes_collapsed_in_tab_${tabId}`]: false })
    .then(rv => rv[`quotes_collapsed_in_tab_${tabId}`]);
}

async function setQuotesCollapsed(tabId, value) {
  return browser.storage.session
    .set({ [`quotes_collapsed_in_tab_${tabId}`]: value });
}

async function toggleQuotes(tabId) {
  // Toggle the saved state.
  let quotesCollapsed = !(await getQuotesCollapsed(tabId));
  await setQuotesCollapsed(tabId, quotesCollapsed);
  // Force the content script to update.
  browser.tabs.sendMessage(tabId, { command: "updateQuotes", quotesCollapsed });
}

// Register an onMessage listener. This listener MUST NEVER be an async function.
// The listener must ALWAYS return a Promise, or false. Check documentation on MDN
// for more details.
browser.runtime.onMessage.addListener((message, sender) => {
  switch (message?.command) {
    case "getQuotesCollapsed":
      return getQuotesCollapsed(sender.tab.id);
    case "toggleQuotes":
      return toggleQuotes(sender.tab.id);
  }
  // The received message was not for, us. Return false to let other listeners
  // get a chance to evaluate the message.
  return false;
})

// Register a listener for the message display action, to toggle the quotes.
browser.messageDisplayAction.onClicked.addListener((tab, info) => {
  toggleQuotes(tab.id);
});

// Register a listener to load the content script into any newly opened message
browser.messageDisplayScripts.register({
  js: [{ file: "/toggle_quotes.js" }]
});
