function toggleQuotes() {
  let otherQuotes = document.querySelectorAll("blockquote");
  let firstQuote = document.querySelector("blockquote");
  if (firstQuote) {
    if (document.body.getAttribute("quotescollapsed") == "collapsed") {
      document.body.removeAttribute("quotescollapsed");
      for (let e of otherQuotes) { 
        e.setAttribute("style", "overflow: unset; height: unset;");
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
      document.body.setAttribute("quotescollapsed", "collapsed");
      document.body.setAttribute("persist", "quotescollapsed");
      for (let e of otherQuotes) {
        e.setAttribute("style", "overflow: hidden; height: 2ex; padding-bottom: .6ex;");
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

function init() {
  let otherQuotes = document.querySelectorAll("blockquote");
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
  toggleButton.addEventListener("click", () => toggleQuotes());
  if (firstQuote) {
    firstQuote.insertAdjacentElement("afterbegin", toggleButton);
    let firstWrap = document.getElementsByTagName("pre").item(1);
    if (firstWrap) firstWrap.setAttribute("style", "display: inline;"); // fix the first quote if wrapped
    if (document.body.getAttribute("quotescollapsed") == "collapsed") {
      document.body.setAttribute("persist", "quotescollapsed");
      for (let e of otherQuotes) {
        e.setAttribute(
          "style",
          `overflow: hidden;
                     height: 2ex;
                     padding-bottom: .6ex;`
        );
      };
      firstQuote.setAttribute(
        "style",
        `overflow: hidden; height: 2ex;
                 background-image: url(chrome://messenger/skin/overrides/arrow-right-12.svg); padding-bottom: .6ex;
                 background-repeat: no-repeat;background-position-x: 1px;
                 background-position-y: center;
                 background-size: 1em;`
      );
    } else {
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
                 background-position-x: 2px;
                 background-position-y: .4ex;
                 background-size: 1em;`
      );
    }
  };
}

init();