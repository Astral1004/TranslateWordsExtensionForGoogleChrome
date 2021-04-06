
document.addEventListener('DOMContentLoaded', function() {
  if(localStorage.getItem("page")) document.getElementsByTagName("html")[0].innerHTML = localStorage.getItem("page");
 
  
let buttonUpdateLanguage = document.getElementById('UpdateLanguage');
buttonUpdateLanguage.addEventListener('click', function() {
  document.getElementsByClassName("language-preferences-card")[0].innerHTML='';
    server()
async function server(){
        try {
          let response = await fetch("https://127.0.0.1:8081/info", {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json;charset=utf-8'
            }
          });

          let json = await response.json();
          updateLanguage(json)
        } catch (error) {
              //console.error('Ошибка:', error);
          }
      }

function updateLanguage(a){
let languagesPairs = new Map(Object.keys(a.pairs).map(x=>[x,[a.pairs[x].first , a.pairs[x].second]]))
let languagesCode = new Map(Object.keys(a.langs).map(x=>[a.langs[x].code, a.langs[x].name]))

    for (var [key, value] of languagesPairs.entries()) {
        let languageFirst =value[0];
        let languageSecond = value[1];
           let languageNameFirst = languagesCode.get(languageFirst)
            
            let languageNameSecond = languagesCode.get(languageSecond)
            

            let stroka = "<div class='col s6' id ='test 1'><label><input type='checkbox' class='filled-in language' data-language-name='"+ languageNameFirst + "-" +  languageNameSecond + "' data-language-code='"+ languageFirst +"' data-language-code2='"+ languageSecond + "' name='prim'/>           <span>"+ languageNameFirst + "-" +  languageNameSecond + "</span></label></div>"
            
            var li = document.createElement("li"); 
            li.innerHTML = stroka;
            document.getElementsByClassName("language-preferences-card")[0].appendChild(li);
    }
    //alert("Обновленно")
    //document.getElementById('1').prop('checked', true)
    localStorage.setItem("page",document.getElementsByTagName("html")[0].innerHTML);

    document.getElementsByTagName("html")[0].innerHTML = localStorage.getItem("page")
    document.getElementById('1').prop('checked', true)
}



});


















  const translateBtn = document.getElementById('translate-btn');

  translateBtn.addEventListener('click', function() {
    chrome.storage.sync.get(['languagePreferences'], function (result) {
      result.languagePreferences.forEach(function (item) {
        for (let key in item) {
          let ss = JSON.stringify(item[key][0].FROM)
          let dd = JSON.stringify(item[key][1].TO)
        
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {
            message:"translate",
            langCode: ss,
            langCode2:dd
            })
          });
        }
      });          
    });
  });
 });

$(document).ready(function () {
  chrome.storage.sync.get(['languagePreferences'], function (result) {
    if (result.languagePreferences && result.languagePreferences.length) {
      result.languagePreferences.forEach(function (item) {
        for (let key in item) {
          //$(':checkbox').prop("disabled",true);
            
                  $(':checkbox').prop("disabled",true);
                  $(`.language[data-language-name='${key}']`).prop('checked', true)
                  $(`.language[data-language-name='${key}']`).prop("disabled",false)
                

         
        }
      });
    }else {
      chrome.storage.sync.set({
        languagePreferences: []
      })
    }
  })

  $('.language').change(function () { 
    let name = $(this).data('language-name');
    let code = $(this).data('language-code');
    let code2 = $(this).data('language-code2');
    let isChecked = $(this).prop('checked');

    $(':checkbox').prop("disabled",true);
    $(this).prop("disabled",false)

    chrome.storage.sync.get(['languagePreferences'], function (result) {
      if (isChecked) {

        result.languagePreferences.push({
          [name]: [{"FROM":code},{"TO":code2}]
        })
      } else {
        result.languagePreferences = result.languagePreferences.filter(function (element, index) {
          return JSON.stringify(element) !== JSON.stringify({ [name]:[{"FROM":code},{"TO":code2}] });
        })
        $(':checkbox').prop("disabled",false);
      }
    
      chrome.storage.sync.set({
        languagePreferences: result.languagePreferences
      }, function () {
        chrome.runtime.sendMessage({
          msg: 'update_language_prefrence'       
        });
      })
    });
  });
 
        $(':checkbox').prop("disabled",false);
});
