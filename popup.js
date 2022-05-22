// background.js

var btn = document.getElementById("showEan")
btn.addEventListener("click", () => {
  
  var inputValue = document.getElementById("ean").value
  if(inputValue.length == 13) {
    chrome.tabs.create({
      url: 'renderEan.html?ean=' + inputValue
    });
  } else {
    alert(inputValue + "isn't an ean13")
  }
})
