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


const canvas = document.getElementById('myCanvas');
if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const barcodeValue = calculateBarCodeValue(ean)
    const mask = getMaskStyle(ean)
    for (let index = 0; index < barcodeValue.length; index++) {
        if (barcodeValue[index] == "1" && mask[index] == "0") {
            drawLine(ctx, [25 + 5*index, 100], [25 + 5*index, 300], "black", 5);
        } else if (barcodeValue[index] == "1" && mask[index] == "1"){
            drawLine(ctx, [25 + 5*index, 100], [25 + 5*index, 350], "black", 5);
        }
    }
    ctx.font = '48px serif'; 
    var firstPart = ean.substring(0,4)
    var secondPart = ean.substring(4)
    var partLen = 4
    if (ean.length == 13) {
        ctx.fillText(ean[0], 0,350)
        firstPart = ean.substring(1,7)
        secondPart = ean.substring(7)
        partLen = 6
    }
    for (let index = 0; index < firstPart.length; index++) {
        ctx.fillText(firstPart[index], 40 + index*35,350)
    }

    for (let index = 0; index < secondPart.length; index++) {
        ctx.fillText(secondPart[index], 40 + 25 + partLen*5*7 + index*35,350)
    }
    
}

var btnPng = document.getElementById("pngSave")
btnPng.addEventListener("click", () => {
  
    const canvas = document.getElementById('myCanvas');
    const pngUrl =canvas.toDataURL();
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "barcode.png";
    link.click();
})

var btnSvg = document.getElementById("svgSave")
btnSvg.addEventListener("click", () => {
  
    const svgEl = generateSvgElement(ean)

    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(svgEl);

    if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    source = '<?xml version="1.0" encoding="utf-8"?>\r\n' + source;

    //convert svg source to URI data scheme.
    var svgurl = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

    const link = document.createElement("a");
    link.href = svgurl;
    link.download = "barcode.svg";
    link.click();
})


function generateSvgElement(ean) {
    const barcodeValue = calculateBarCodeValue(ean)
    const svgContainer = document.createElementNS("http://www.w3.org/2000/svg",'svg')
    svgContainer.setAttribute("version","1.1")
    svgContainer.setAttribute("baseProfile","full")
    svgContainer.setAttribute("width","700")
    svgContainer.setAttribute("height","200")
    

    const gContainer = document.createElementNS('http://www.w3.org/2000/svg','g');
    gContainer.setAttribute("stroke","black")
    let index = 10;
    for (let indexB = 0; indexB < barcodeValue.length; indexB++) {
        if (barcodeValue[indexB] == "1"){
            const lineContainer = document.createElementNS('http://www.w3.org/2000/svg','line');
            lineContainer.setAttribute("stroke-width",4)
            lineContainer.setAttribute("y1",10)
            lineContainer.setAttribute("x1",index)
            lineContainer.setAttribute("y2",50)
            lineContainer.setAttribute("x2",index)
            gContainer.appendChild(lineContainer)
        }
        index = index + 4
    };


    svgContainer.appendChild(gContainer)

    return svgContainer
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
        var firstPartRaw = eanValue.substring(0,4)
        var lastPartRaw = eanValue.substring(4)
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

function getMaskStyle(eanValue) {
    var styleMask ="111"

    if (eanValue.length == 13){
        var numberOfValue = 6

     } else if (eanValue.length == 8) {
        var numberOfValue = 4

    } else {
        return ""
    }

    for (let index = 0; index < numberOfValue; index++) {
        styleMask = styleMask +"0000000"
    }

    styleMask = styleMask +"11111"

    for (let index = 0; index < numberOfValue; index++) {
        styleMask = styleMask +"0000000"
    }

    styleMask = styleMask +"111"

    return styleMask
}