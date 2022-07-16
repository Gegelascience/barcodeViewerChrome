setA = {
    "0":"0001101",
    "1":"0011001",
    "2":"0010011",
    "3":"0111101",
    "4":"0100011",
    "5":"0110001",
    "6":"0101111",
    "7":"0111011",
    "8":"0110111",
    "9":"0001011",
}

setB = {
    "0":"0100111",
    "1":"0110011",
    "2":"0011011",
    "3":"0100001",
    "4":"0011101",
    "5":"0111001",
    "6":"0000101",
    "7":"0010001",
    "8":"0001001",
    "9":"0010111",
}

setC = {
    "0":"1110010",
    "1":"1100110",
    "2":"1101100",
    "3":"1000010",
    "4":"1011100",
    "5":"1001110",
    "6":"1010000",
    "7":"1000100",
    "8":"1001000",
    "9":"1110100",
}



const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

var ean =params.ean

const eanText = document.getElementById("eanValue")

eanText.innerText = ean

const canvas = document.getElementById('myCanvas');
if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const barcodeValue = calculateBarCodeValue(ean)
    for (let index = 0; index < barcodeValue.length; index++) {
        if (barcodeValue[index] == "1") {
            drawLine(ctx, [25 + 5*index, 100], [25 + 5*index, 300], "black", 5);
        }
    }
    
}


function drawLine(ctx, begin, end, stroke = 'black', width = 1) {
    if (stroke) {
        ctx.strokeStyle = stroke;
    }

    if (width) {
        ctx.lineWidth = width;
    }

    ctx.beginPath();
    ctx.moveTo(...begin);
    ctx.lineTo(...end);
    ctx.stroke();
}

function calculateBarCodeValue(eanValue) {
    var barcodeValue = "101"

    var prefix = eanValue[0]

    if (eanValue.length == 13){
        var firstPartRaw = eanValue.substring(1,7)
        var lastPartRaw = eanValue.substring(7)
    } else if (eanValue.length == 8) {
        var firstPartRaw = eanValue.substring(1,5)
        var lastPartRaw = eanValue.substring(5)
    } else {
        return ""
    }
    

    for (let index = 0; index < firstPartRaw.length; index++) {
        if (firstPartRaw.length == 6){
            setToApply = findSetByPrefixAndIndex(prefix,index)
            if (setToApply == "A") {
                barcodeValue = barcodeValue + setA[firstPartRaw[index]]
            } else {
                barcodeValue = barcodeValue + setB[firstPartRaw[index]]
            }
        } else {
            barcodeValue = barcodeValue + setA[firstPartRaw[index]]
        }
        
    }

    barcodeValue = barcodeValue + "01010"

    for (let index = 0; index < lastPartRaw.length; index++) {
        barcodeValue = barcodeValue + setC[lastPartRaw[index]]
        
    }
    
    barcodeValue = barcodeValue + "101"

    return barcodeValue
}

function findSetByPrefixAndIndex(prefix,index) {

    if (index == 0 || prefix == "0"){
        return "A"
    } else if (prefix == "1"){

        return (index==1 || index==3) ? "A" : "B"

    } else if (prefix == "2") {
        
        return (index==1 || index==4) ? "A" : "B"
    
    } else if (prefix == "3") {
    
        return (index==1 || index==5) ? "A" : "B"
    
    } else if (prefix == "4") {
    
        return (index==2 || index==3) ? "A" : "B"
    
    } else if (prefix == "5") {
    
        return (index==3 || index==4) ? "A" : "B"
    
    } else if (prefix == "6") {
    
        return (index==4 || index==5) ? "A" : "B"
    
    } else if (prefix == "7") {
    
        return (index==2 || index==4) ? "A" : "B"
    
    } else if (prefix == "8") {
    
        return (index==2 || index==5) ? "A" : "B"
    
    } else if (prefix == "9") {
    
        return (index==3 || index==5) ? "A" : "B"
    
    }
            
}