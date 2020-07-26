const video = document.querySelector('video');
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d');
const photoCaptureDiv = document.querySelector('.photoCaptureDiv');
const photoCaptureDivButton = document.querySelector('button');

window.addEventListener('load',liveCam);

function liveCam(){
    navigator.mediaDevices.getUserMedia({video: true,audio: false})
    .then(localmediaStream => {
        video.srcObject = localmediaStream;
        video.play();
        setInterval(()=>{
            ctx.drawImage(video,0,0,canvas.width,canvas.height);
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
    console.log(photoCaptureDiv.clientWidth);
})