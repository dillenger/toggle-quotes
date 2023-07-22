var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
var { ExtensionSupport } = ChromeUtils.import("resource:///modules/ExtensionSupport.jsm");
var Services = globalThis.Services || ChromeUtils.import("resource://gre/modules/Services.jsm");

var toggleQuotesApi = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    return {
      toggleQuotesApi: {
        async toggleQuotes(windowId) {
          let browser = context.extension.windowManager.get(windowId, context).window.getBrowser();
          if (browser) {
            let recentContent = browser.contentWindow;
            if (recentContent) {
              let otherQuotes = recentContent.document.querySelectorAll("blockquote");
              let firstQuote = recentContent.document.querySelector("blockquote");
              if (firstQuote) {
                if (browser.getAttribute("quotescollapsed") == "collapsed") {
                  browser.removeAttribute("quotescollapsed");
                  for (let e of otherQuotes) {e.setAttribute("style", "overflow: unset; height: unset;");};
                  firstQuote.setAttribute("style", "overflow: unset; height: unset;\
                    background-image: url(chrome://messenger/skin/overrides/arrow-down-12.svg); padding-block: .5ex;\
                    background-repeat: no-repeat; background-position-x: 1px; background-position-y: .4ex; background-size: 1em;");
                } else {
                  browser.setAttribute("quotescollapsed", "collapsed");
                  browser.setAttribute("persist", "quotescollapsed");
                  for (let e of otherQuotes) {e.setAttribute("style", "overflow: hidden; height: 2ex; padding-bottom: .6ex;");};
                  firstQuote.setAttribute("style", "overflow: hidden; height: 2ex;\
                    background-image: url(chrome://messenger/skin/overrides/arrow-right-12.svg); padding-bottom: .6ex;\
                    background-repeat: no-repeat;background-position-x: 1px; background-position-y: center; background-size: 1em;");
                }
              };
            }
          }
        },
        async loadButton(windowId) {
          let browser = context.extension.windowManager.get(windowId, context).window.getBrowser();
          if (browser) {
            let recentContent = browser.contentWindow;
            if (recentContent) {
              let otherQuotes = recentContent.document.querySelectorAll("blockquote");
              let firstQuote = recentContent.document.querySelector("blockquote");
              let toggleButton = recentContent.document.querySelector("button");
              if (!toggleButton) toggleButton = recentContent.document.createElement("button");
              toggleButton.setAttribute("style", "background-color: transparent;\
                border-color: transparent; margin-inline: -5px 2px; padding-top: 10px;");
              toggleButton.addEventListener("click", () => this.toggleQuotes(windowId));
              if (firstQuote) {
                firstQuote.insertAdjacentElement("afterbegin", toggleButton);
                let firstWrap = recentContent.document.getElementsByTagName("pre").item(1);
                if (firstWrap) firstWrap.setAttribute("style", "display: inline;"); // fix the first quote if wrapped
                if (browser.getAttribute("quotescollapsed") == "collapsed") {
                  browser.setAttribute("persist", "quotescollapsed");
                  for (let e of otherQuotes) {e.setAttribute("style", "overflow: hidden; height: 2ex; padding-bottom: .6ex;");};
                  firstQuote.setAttribute("style", "overflow: hidden; height: 2ex;\
                    background-image: url(chrome://messenger/skin/overrides/arrow-right-12.svg); padding-bottom: .6ex;\
                    background-repeat: no-repeat;background-position-x: 1px; background-position-y: center; background-size: 1em;");
                } else {
                  for (let e of otherQuotes) {e.setAttribute("style", "overflow: unset; height: unset;");};
                  firstQuote.setAttribute("style", "overflow: unset; height: unset;\
                    background-image: url(chrome://messenger/skin/overrides/arrow-down-12.svg); padding-block: .5ex;\
                    background-repeat: no-repeat; background-position-x: 2px; background-position-y: .4ex; background-size: 1em;");
                }
              };
            }
          }
        },
      },
    };
  }
};
