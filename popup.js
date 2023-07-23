// background.js

var btn = document.getElementById("showEan")
btn.addEventListener("click", () => {
  
  var inputValue = document.getElementById("ean").value
  console.log("test", isCorrectEan)
  if((inputValue.length == 13 || inputValue.length == 8) && isCorrectEan(inputValue)) {
    chrome.tabs.create({
      url: 'renderEan.html?ean=' + inputValue
    });
  } else {
    alert(inputValue + " isn't an ean13 or ean8")
  }
})

   

