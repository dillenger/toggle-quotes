var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
var { ExtensionSupport } = ChromeUtils.import("resource:///modules/ExtensionSupport.jsm");
var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
var xulAppInfo = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);

let doToggle = undefined;

var toggleQuotesApi = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    return {
      toggleQuotesApi: {
        async toggleQuotes(windowId) {
          let recentWindow = context.extension.windowManager.get(windowId, context).window;
          if (recentWindow) {
            let recentContent = recentWindow.document.getElementById("messagepane").contentWindow;
            let otherQuotes = recentContent.document.querySelectorAll("blockquote");
            let firstQuote = recentContent.document.querySelector("blockquote");
            let messagePane = recentWindow.document.getElementById("messagepane");
            if (firstQuote) {
              if (messagePane.getAttribute("quotescollapsed") == "collapsed") {
                messagePane.removeAttribute("quotescollapsed");
                for (let e of otherQuotes) {e.setAttribute("style", "overflow: unset; height: unset;");};
                if (xulAppInfo.version < "91") {
                  firstQuote.setAttribute("style", "overflow: unset; height: unset;\
                    background-image: url(chrome://global/skin/icons/twisty-expanded.svg); padding-block: .5ex;\
                    background-repeat: no-repeat; background-position-x: 2px; background-position-y: .4ex; background-size: 1em;");
                } else {
                  firstQuote.setAttribute("style", "overflow: unset; height: unset;\
                    background-image: url(chrome://global/skin/icons/arrow-down-12.svg); padding-bottom: .6ex;\
                    background-repeat: no-repeat; background-position-x: 1px; background-position-y: .4ex; background-size: 1em;");
                }
              } else {
                messagePane.setAttribute("quotescollapsed", "collapsed");
                messagePane.setAttribute("persist", "quotescollapsed");
                for (let e of otherQuotes) {e.setAttribute("style", "overflow: hidden; height: 2ex; padding-bottom: .6ex;");};
                if (xulAppInfo.version < "91") {
                  firstQuote.setAttribute("style", "overflow: hidden; height: 2ex;\
                    background-image: url(chrome://global/skin/icons/twisty-collapsed.svg); padding-block: .5ex;\
                    background-repeat: no-repeat;background-position-x: 3px; background-position-y: center; background-size: 1em;");
                } else {
                  firstQuote.setAttribute("style", "overflow: hidden; height: 2ex;\
                    background-image: url(chrome://global/skin/icons/arrow-right-12.svg); padding-bottom: .6ex;\
                    background-repeat: no-repeat;background-position-x: 1px; background-position-y: center; background-size: 1em;");
                }
              }
            };
          }
        },
        async loadButton(windowId) {
          let recentWindow = context.extension.windowManager.get(windowId, context).window;
          if (recentWindow) {
            doToggle = () => this.toggleQuotes();
            recentWindow.addEventListener('DOMContentLoaded', (event) => {
              let recentContent = recentWindow.document.getElementById("messagepane").contentWindow;
              if (recentContent == null) return;
              let otherQuotes = recentContent.document.querySelectorAll("blockquote");
              let firstQuote = recentContent.document.querySelector("blockquote");
              let messagePane = recentWindow.document.getElementById("messagepane");

              let toggleButton = recentContent.document.querySelector("button");
              if (toggleButton) toggleButton.remove(); // remove it first to avoid duplicates
              toggleButton = recentContent.document.createElement("button");
              toggleButton.setAttribute("style", "background-color: transparent;\
                border-color: transparent; margin-inline: -5px 2px; padding-top: 10px;");

              toggleButton.addEventListener("click", doToggle);

              if (firstQuote) {
                firstQuote.insertAdjacentElement("afterbegin", toggleButton);

                let firstWrap = recentContent.document.getElementsByTagName("pre").item(1);
                if (firstWrap) firstWrap.setAttribute("style", "display: inline-flex;"); // fix the first quote if wrapped

                if (messagePane.getAttribute("quotescollapsed") == "collapsed") {
                  messagePane.setAttribute("persist", "quotescollapsed");
                  for (let e of otherQuotes) {e.setAttribute("style", "overflow: hidden; height: 2ex; padding-bottom: .6ex;");};
                  if (xulAppInfo.version < "91") {
                    firstQuote.setAttribute("style", "overflow: hidden; height: 2ex;\
                      background-image: url(chrome://global/skin/icons/twisty-collapsed.svg); padding-block: .5ex;\
                      background-repeat: no-repeat;background-position-x: 3px; background-position-y: center; background-size: 1em;");
                  } else {
                    firstQuote.setAttribute("style", "overflow: hidden; height: 2ex;\
                      background-image: url(chrome://global/skin/icons/arrow-right-12.svg); padding-bottom: .6ex;\
                      background-repeat: no-repeat;background-position-x: 1px; background-position-y: center; background-size: 1em;");
                  }
                } else {
                  for (let e of otherQuotes) {e.setAttribute("style", "overflow: unset; height: unset;");};
                  if (xulAppInfo.version < "91") {
                  firstQuote.setAttribute("style", "overflow: unset; height: unset;\
                    background-image: url(chrome://global/skin/icons/twisty-expanded.svg); padding-block: .5ex;\
                    background-repeat: no-repeat; background-position-x: 2px; background-position-y: .4ex; background-size: 1em;");
                  } else {
                  firstQuote.setAttribute("style", "overflow: unset; height: unset;\
                    background-image: url(chrome://global/skin/icons/arrow-down-12.svg); padding-bottom: .6ex;\
                    background-repeat: no-repeat; background-position-x: 1px; background-position-y: .4ex; background-size: 1em;");
                  }
                }
              };
            });
          }
        },
      },
    };
  }
};
