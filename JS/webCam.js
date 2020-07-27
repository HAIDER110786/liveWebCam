const video = document.querySelector('video');
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d');
const photoCaptureDiv = document.querySelector('.photoCaptureDiv');
const photoCaptureDivButton = document.querySelector('button');
const buttons = document.querySelectorAll('.buttonDiv button');
const inputs = document.querySelectorAll('.inputDiv input');
let redEffectActive = false;
let blueEffectActive = false;
let greenEffectActive = false;
let splitEffectActive = false;
let transparencyActive = false;
let rgbRange = {};

window.addEventListener('load',liveCam);
buttons.forEach(button => {
    button.addEventListener('click',handleClick);
})
inputs.forEach(input =>{
    input.addEventListener('change',enableTransparency);
});

function enableTransparency(){
    redEffectActive=false;
    blueEffectActive=false;
    greenEffectActive=false;
    splitEffectActive=false;
    transparencyActive=true;
}

function handleChange(pixels){
    inputs.forEach(function(input){
        rgbRange[input.name]= input.value;
    })
    
    for (let index = 0; index < pixels.data.length; index+=4) {
        if(pixels.data[index]   > rgbRange.rmin && pixels.data[index]<rgbRange.rmax 
        && pixels.data[index+1] > rgbRange.gmin && pixels.data[index+1]<rgbRange.gmax 
        && pixels.data[index+2] > rgbRange.bmin && pixels.data[index+2]<rgbRange.bmax ){
            pixels.data[index+3] = 0;
        }
    }
    return pixels;
}

function handleClick(e){
    switch(e.target.dataset.buttonEffect){
        case '1':
            redEffectActive=true;
            blueEffectActive=false;
            greenEffectActive=false;
            splitEffectActive=false;
            transparencyActive=false;
            break;
        case '2':
            redEffectActive=false;
            blueEffectActive=false;
            greenEffectActive=true;
            splitEffectActive=false;
            transparencyActive=false;
            break;
        case '3':
            redEffectActive=false;
            blueEffectActive=true;
            greenEffectActive=false;
            splitEffectActive=false;
            transparencyActive=false;
            break;
        case '4':
            redEffectActive=false;
            blueEffectActive=false;
            greenEffectActive=false;
            splitEffectActive=false;
            break;
        case '5':
            redEffectActive=false;
            blueEffectActive=false;
            greenEffectActive=false;
            splitEffectActive=false;
            transparencyActive=false;
            rgbRange={};
            inputs.forEach(input=>input.value=128);
            break;
    }
}

function liveCam(){
    navigator.mediaDevices.getUserMedia({video: true,audio: false})
    .then(localmediaStream => {
        video.srcObject = localmediaStream;
        video.play();
        setInterval(()=>{
            ctx.drawImage(video,0,0,canvas.width,canvas.height);
            if(redEffectActive){
                let pixels = ctx.getImageData(0,0,canvas.width,canvas.height);
                pixels = redEffect(pixels);
                ctx.putImageData(pixels,0,0);
            }
            else if(blueEffectActive){
                let pixels = ctx.getImageData(0,0,canvas.width,canvas.height);
                pixels = blueEffect(pixels);
                ctx.putImageData(pixels,0,0);
            }
            else if(greenEffectActive){
                let pixels = ctx.getImageData(0,0,canvas.width,canvas.height);
                pixels = greenEffect(pixels);
                ctx.putImageData(pixels,0,0);
            }
            else if(splitEffectActive){
                let pixels = ctx.getImageData(0,0,canvas.width,canvas.height);
                pixels = splitEffect(pixels);
                ctx.putImageData(pixels,0,0);
            }
            else if(transparencyActive){
                console.log('object');
                let pixels = ctx.getImageData(0,0,canvas.width,canvas.height);
                pixels = handleChange(pixels);
                ctx.putImageData(pixels,0,0);
            }
        }, 16);
    })
    .catch(err => alert(err));
}

photoCaptureDivButton.addEventListener('click', () => {
    const a = document.createElement('a');
    a.setAttribute('href',canvas.toDataURL());
    a.innerHTML = `<img src="${canvas.toDataURL()}" height="180px" alt="a picture of me">`;
    a.setAttribute('download','me.jpeg');
    photoCaptureDiv.childElementCount>0 ? photoCaptureDiv.insertBefore(a,photoCaptureDiv.firstChild) : photoCaptureDiv.appendChild(a);
})

function greenEffect(pixels){
    for (let index = 0; index < pixels.data.length; index+=4) {
        pixels.data[index+0] = pixels.data[index+0] + 10;
        pixels.data[index+1] = pixels.data[index+1] + 200;
        pixels.data[index+2] = pixels.data[index+2] + 50;
    }
    return pixels;
}

function splitEffect(pixels){
    for (let index = 0; index < pixels.data.length; index+=4) {
        pixels.data[index-150] = pixels.data[index+0];
        pixels.data[index+100] = pixels.data[index+1];
        pixels.data[index-150] = pixels.data[index+2];
    }
    return pixels;
}

function redEffect(pixels) {
    for (let index = 0; index < pixels.data.length; index+=4) {
        pixels.data[index+0] = pixels.data[index+0] + 100;
        pixels.data[index+1] = pixels.data[index+1] - 50;
        pixels.data[index+2] = pixels.data[index+2] * 0.5;
    }
    return pixels;
}

function blueEffect(pixels) {
    for (let index = 0; index < pixels.data.length; index+=4) {
        pixels.data[index+0] = pixels.data[index+0] ;
        pixels.data[index+1] = pixels.data[index+2] ;
        pixels.data[index+2] = pixels.data[index+1] + 200;
    }
    return pixels;
}