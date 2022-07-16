// background.js

var btn = document.getElementById("showEan")
btn.addEventListener("click", () => {
  
  var inputValue = document.getElementById("ean").value
  if((inputValue.length == 13 || inputValue.length == 8) && isCorrectEan(inputValue)) {
    chrome.tabs.create({
      url: 'renderEan.html?ean=' + inputValue
    });
  } else {
    alert(inputValue + " isn't an ean13 or ean8")
  }
})


function isCorrectEan(inputValue) {
  if (! inputValue){
    return false
  }
        
  var testLen = inputValue.length

  if (testLen != 13 && testLen != 8){
    return false
  }

  if (! (inputValue.match(/^[0-9]+$/) != null && parseInt(inputValue) >0)){
    return false
  }

  var eanDigitLess = inputValue.slice(0,testLen-1)
  var possibleDigitCheck = inputValue[testLen-1]
  if (possibleDigitCheck != calculateDigitCheck(eanDigitLess)){
      return false
  }
            
  return true
  
}


function calculateDigitCheck(eanDigitCheckLess) {

  var lenstrCalcul = eanDigitCheckLess.length
  var factor = 3
  var somme = 0

  if (! (eanDigitCheckLess.match(/^[0-9]+$/) != null && parseInt(eanDigitCheckLess) >0)){
    return "KO"
  }

  for (let index = lenstrCalcul -1; index >-1 ; index--) {
    somme += parseInt(eanDigitCheckLess[index]) * factor
    factor = 4 - factor
  }   
      
  digitCheck = ((10 - (somme % 10))%10).toString()

  return digitCheck
}
   

