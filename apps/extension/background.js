if (import.meta.env.VITE_EXTENSION === 'FIREFOX') {
  browser.action.onClicked.addListener(() => {
    browser.tabs.create({})
  })
} else {
  chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: 'chrome://newtab' })
  })
}
