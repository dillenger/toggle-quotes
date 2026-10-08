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
         background-image: url("data:image/svg+xml;base64,PCEtLSBUaGlzIFNvdXJjZSBDb2RlIEZvcm0gaXMgc3ViamVjdCB0byB0aGUgdGVybXMgb2YgdGhlIE1vemlsbGEgUHVibGljCiAgIC0gTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpcwogICAtIGZpbGUsIFlvdSBjYW4gb2J0YWluIG9uZSBhdCBodHRwOi8vbW96aWxsYS5vcmcvTVBMLzIuMC8uIC0tPgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEyIiBoZWlnaHQ9IjEyIiB2aWV3Qm94PSIwIDAgMTIgMTIiIGZpbGw9ImNvbnRleHQtZmlsbCI+CiAgPHBhdGggZD0iTTYgNi43NWwzLjIyLTMuMjJjLjcxLS43IDEuNzcuMzYgMS4wNiAxLjA3TDYuNTMgOC4zNGMtLjMuMy0uNzcuMy0xLjA2IDBMMS43MiA0LjU5Yy0uNjYtLjcuMzUtMS43MiAxLjA2LTEuMDZ6Ii8+Cjwvc3ZnPgo=");
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
         background-image: url("data:image/svg+xml;base64,PCEtLSBUaGlzIFNvdXJjZSBDb2RlIEZvcm0gaXMgc3ViamVjdCB0byB0aGUgdGVybXMgb2YgdGhlIE1vemlsbGEgUHVibGljCiAgIC0gTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpcwogICAtIGZpbGUsIFlvdSBjYW4gb2J0YWluIG9uZSBhdCBodHRwOi8vbW96aWxsYS5vcmcvTVBMLzIuMC8uIC0tPgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEyIiBoZWlnaHQ9IjEyIiB2aWV3Qm94PSIwIDAgMTIgMTIiIGZpbGw9ImNvbnRleHQtZmlsbCI+CiAgPHBhdGggZD0iTTcuMjUgNkw0LjAzIDIuNzhBLjc1Ljc1IDAgMDE1LjEgMS43MmwzLjc0IDMuNzVjLjMuMy4zLjc3IDAgMS4wNmwtMy43NSAzLjc1YS43NS43NSAwIDAxLTEuMDYtMS4wNnoiLz4KPC9zdmc+Cg==");
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
