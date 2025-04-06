function updateQuotes(quotesCollapsed) {
  let otherQuotes = document.querySelectorAll("blockquote");
  let firstQuote = document.querySelector("blockquote");
  if (firstQuote) {
    if (!quotesCollapsed) {
      for (let e of otherQuotes) {
        e.setAttribute(
          "style",
          `overflow: unset;
           height: unset;`
        );
      };
      firstQuote.setAttribute(
        "style",
        `overflow: unset;
         height: unset;
         background-image: url(chrome://messenger/skin/overrides/arrow-down-12.svg);
         padding-bottom: .3ex;
         background-repeat: no-repeat;
         background-position-x: 1px;
         background-position-y: .4ex;
         background-size: 1em;`
      );
    } else {
      for (let e of otherQuotes) {
        e.setAttribute(
          "style",
          `overflow: hidden;
           height: 2ex;
           padding-bottom: .6ex;`);
      };
      firstQuote.setAttribute(
        "style",
        `overflow: hidden;
         height: 2ex;
         background-image: url(chrome://messenger/skin/overrides/arrow-right-12.svg);
         padding-bottom: .6ex;
         background-repeat: no-repeat;
         background-position-x: 1px;
         background-position-y: center;
         background-size: 1em;`
      );
    }
  };
}

async function init() {
  let firstQuote = document.querySelector("blockquote");
  let toggleButton = document.querySelector("button");
  if (!toggleButton) toggleButton = document.createElement("button");
  toggleButton.setAttribute(
    "style",
    `background-color: transparent;
         border-color: transparent;
         margin-inline: -5px 2px;
         padding-top: 10px;`
  );
  toggleButton.addEventListener("click", () => browser.runtime.sendMessage({ command: "toggleQuotes" }));

  if (firstQuote) {
    firstQuote.insertAdjacentElement("afterbegin", toggleButton);
    let firstWrap = document.getElementsByTagName("pre").item(1);
    if (firstWrap) firstWrap.setAttribute("style", "display: inline;"); // fix the first quote if wrapped

    let quotesCollapsed = await browser.runtime.sendMessage({ command: "getQuotesCollapsed" });
    updateQuotes(quotesCollapsed);
  };

  // Allow the background to talk to us.
  browser.runtime.onMessage.addListener(message => {
    switch (message?.command) {
      case "updateQuotes":
        return Promise.resolve(updateQuotes(message.quotesCollapsed));
      case "toggleQuotesLoaded":
        return Promise.resolve(true);
    }
    // The received message was not for, us. Return false to let other listeners
    // get a chance to evaluate the message.
    return false;
  })
}

init();
