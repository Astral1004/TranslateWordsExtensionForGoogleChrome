chrome.tabs.query({}, function (tabs) {
  tabs.forEach(function (tab) {
    if (!tab.url.includes('chrome://') && !tab.url.includes('chrome.google.com')) {
      chrome.tabs.executeScript(tab.id, {
        file: './js/jquery-3.5.0.min.js'
      });
      chrome.tabs.executeScript(tab.id, {
        file: './js/content.js'
      });
    }
  })
});



function createContextMenu() {
  chrome.contextMenus.removeAll(function () {});
  chrome.storage.sync.get(['languagePreferences'], function (result) {
    if (result.languagePreferences && result.languagePreferences.length) {
      result.languagePreferences.forEach(function (item) {
        for (let key in item) {
          let ss = JSON.stringify(item[key][0].FROM)
          let dd = JSON.stringify(item[key][1].TO)

          chrome.contextMenus.create({
            title: `Перевести на ${key}`,
            contexts: ['selection'],
            onclick: function (info, tab) {
              if (info.selectionText) {
                chrome.tabs.query({
                  active: true,
                  currentWindow: true
                }, function (tabs) {
                  chrome.tabs.sendMessage(tabs[0].id, {
                    word: info.selectionText,
                    langCode: ss,
                    langCode2:dd
                  }, function (response) {
                    });
                  });
              }
            }
          });
        }
      })
    } else {
      chrome.contextMenus.create({
        title: 'Для начала выберите язык',
        contexts: ['selection']
      });
    }
  });
}

createContextMenu();

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.msg === 'update_language_prefrence') {
      createContextMenu();// Создаст контекстное меню при выборе языка
    }
  }
);
