


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.message === "translate") {
      let map = new Map();
      traverse(document);
      let jsonToMap = convertMapToJson(map);
      let translateMap = new Map()
      server(jsonToMap)

      async function server(a){
        try {
          let response = await fetch("https://127.0.0.1:8081/trsite", {
            method: 'POST',
            body: jsonToMap, 
            headers: {
            'Content-Type': 'application/json;charset=utf-8'
            }
          });

          let json = await response.json();
          convertJsonToMap(json)
        } catch (error) {
              //console.error('Ошибка:', error);
          }
      }

function traverse(elm) {
    if (elm.nodeType == Node.ELEMENT_NODE || elm.nodeType == Node.DOCUMENT_NODE) {
        if (isExcluded(elm)) {
            return
        }
        for (var i = 0; i < elm.childNodes.length; i++) {
            traverse(elm.childNodes[i]);
        }
    }
    if (elm.nodeType == Node.TEXT_NODE) {
        let id = generateUUID();
        if (elm.nodeValue.trim() == "") {
            return
        }
        map.set(id,elm.nodeValue);
        elm.nodeValue = id;
    }
    return map;
}

function reserveTranslateText(elm) {
    if (elm.nodeType == Node.ELEMENT_NODE || elm.nodeType == Node.DOCUMENT_NODE) {
        if (isExcluded(elm)) {
            return
        }
        for (var i = 0; i < elm.childNodes.length; i++) {
            reserveTranslateText(elm.childNodes[i]);
        }
    }
    if (elm.nodeType == Node.TEXT_NODE) {
        if (elm.nodeValue.trim() == "") {
            return
        }
        for (let vegetable of translateMap.keys()) {
             if(elm.nodeValue == vegetable){
             elm.nodeValue=translateMap.get(vegetable);
            } 
        }
    }
}

function convertMapToJson(map){
  let langSiteFrom = request.langCode.replace(/"/g,"");
  let langSiteTo = request.langCode2.replace(/"/g,"");
  const result = JSON.stringify({ from:langSiteFrom,to:langSiteTo ,text: Object.fromEntries(map)});

  return result
}
function convertJsonToMap(a){
  translateMap = new Map(Object.keys(a.text).map(x=>[x, a.text[x]]))
  reserveTranslateText(document)

  return translateMap;
}

function isExcluded(elm) {
    if (elm.tagName == "STYLE") {
        return true;
    }
    if (elm.tagName == "SCRIPT") {
        return true;
    }
    if (elm.tagName == "NOSCRIPT") {
        return true;
    }
    if (elm.tagName == "IFRAME") {
        return true;
    }
    if (elm.tagName == "OBJECT") {
        return true;
    }
    if (elm.tagName == "TITLE"){
        return true;
    }
    return false
}
function generateUUID(){
  var d = new Date().getTime();
  var uuid = 'xx-xx-4x-yx-xx'.replace(/[xy]/g, function(c) {
  var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
    return uuid;
}   
    } else if (request.message === "replace") {
        find = request.find;
        replace = request.replace;

        replaceText(document.body);
    } else if (request.message === "error") {
        console.log("Sorry some error happened :(");
      }
  /**************************************************************************************/

try {
    let selectedText = window.getSelection && window.getSelection();
    
    if (selectedText.rangeCount > 0) {
     serv()
      async function serv(){
        let words = request.word;
        let lang = request.langCode.replace(/"/g,"");
        let lang2 = request.langCode2.replace(/"/g,"");
        let jsonToMap2 = JSON.stringify({ from:lang,to:lang2,text:{1:words}})

        try {
          let response2 = await fetch("https://127.0.0.1:8081/trsite", {
            method: 'POST',
            body: jsonToMap2, 
            headers: {
            'Content-Type': 'application/json;charset=utf-8'
            }
          }); 
            let range = selectedText.getRangeAt(0);
            let result = '';
            const data = await response2.json();
            const words = data.text[1]

            range.deleteContents();
            range.insertNode(range.createContextualFragment(words));// Вставка нода(нового текста) в страницу
        }catch{}
      }
    }else if (document.selection && document.selection.createRange) {
      let range = document.selection.createRange();
      range.text = response;
    }
} catch (err) {
    throw err;
  }
});


