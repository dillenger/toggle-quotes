export async function getQuotesCollapsed(tabId) {
  return browser.storage.session
    .get({ [`quotes_collapsed_in_tab_${tabId}`]: false })
    .then(rv => rv[`quotes_collapsed_in_tab_${tabId}`]);
}

export async function setQuotesCollapsed(tabId, value) {
  return browser.storage.session
    .set({ [`quotes_collapsed_in_tab_${tabId}`]: value });
}

export async function toggleQuotes(tabId) {
  // Toggle the saved state.
  let quotesCollapsed = !(await getQuotesCollapsed(tabId));
  await setQuotesCollapsed(tabId, quotesCollapsed);
  // Force the content script to update.
  await browser.tabs.sendMessage(tabId, { command: "updateQuotes", quotesCollapsed });
}

export async function checkIfLoaded(tabId) {
  try {
    await browser.tabs.sendMessage(tabId, { command: "toggleQuotesLoaded" });
    return true;
  } catch {
    return false;
  }
}
