chrome.action.onClicked.addListener(tab => {
  const { url } = tab
  console.log(tab)

  chrome.runtime.reload()

  // chrome.tabs.create({ url: 'chrome://newtab' })
})

// chrome.tabs.onCreated.addListener(t => {
//   console.log('TabCreated: ' + t.pendingUrl)
//
//   if ((t.pendingUrl || t.url) === 'chrome://newtab/') {
//     // method-A:
//     chrome.tabs.update(t.id, { url: 'index.html' })
//     // method-B:
//     // setTimeout(()=>chrome.tabs.update(t.id, {url: 'https://www.google.com'}), 300);
//   }
// })
//
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.url) {
//     console.log('TabUpdated: ' + changeInfo.url)
//   }
// })
