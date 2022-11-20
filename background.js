function processCodes(selectionText) {
  const pattern = /[A-Z0-9-]{13,16}/g;

  return [...selectionText.matchAll(pattern)].map((d) => d[0]);
}

browser.menus.create({
  id: "find-codes",
  title: "Find Pokemon TCG redeem codes",
  contexts: ["selection"],
});

browser.menus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "find-codes":
      browser.sidebarAction.open().then(() => {
        setTimeout(() => {
          browser.runtime.sendMessage({
            action: "addCode",
            codes: processCodes(info.selectionText),
          });
        }, 300);
      });
      break;
  }
});

browser.browserAction.onClicked.addListener(() => {
  browser.sidebarAction.open();
});
