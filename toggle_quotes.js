function updateQuotes(quotesCollapsed) {
  let otherQuotes = document.querySelectorAll("blockquote");
  let firstQuote = document.querySelector("blockquote");
  if (firstQuote) {
    if (!quotesCollapsed) {
      for (let e of otherQuotes) {
        e.setAttribute(
          "style",
          `overflow: unset;
           height: unset;
           background-color: rgba(128,128,128,0.5);
           margin-inline: 0px;
           padding-inline: 1ex;`
        );
      };
      firstQuote.setAttribute(
        "style",
        `overflow: unset;
         height: unset;
         background-color: rgba(128,128,128,0.5);
         background-image: url(chrome://messenger/skin/overrides/arrow-down-12.svg);
         background-position-x: 1px;
         background-position-y: .4ex;
         background-repeat: no-repeat;
         background-size: 1em;
         border-inline-start: 2px solid rgb(128,128,128);
         margin-inline: 0px;
         padding-inline: 1ex;
         padding-bottom: .3ex;`
      );
    } else {
      for (let e of otherQuotes) {
        e.setAttribute(
          "style",
          `overflow: hidden;
           height: 2ex;
           background-color: rgba(128,128,128,0.5);
           margin-inline: 0px;
           padding-inline: 1ex;
           padding-bottom: .6ex;`
        );
      };
      firstQuote.setAttribute(
        "style",
        `overflow: hidden;
         height: 2ex;
         background-color: rgba(128,128,128,0.5);
         background-image: url(chrome://messenger/skin/overrides/arrow-right-12.svg);
         background-position-x: 1px;
         background-position-y: center;
         background-repeat: no-repeat;
         background-size: 1em;
         border-inline-start: 2px solid rgb(128,128,128);
         margin-inline: 0px;
         padding-inline: 1ex;
         padding-bottom: .6ex;`
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
