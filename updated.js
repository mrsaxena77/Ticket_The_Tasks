let video = document.querySelector("video");
let recordBtn = document.querySelector("#record");
let recDiv = recordBtn.querySelector("div");
let capBtn = document.querySelector("#capture");
let capDiv = capBtn.querySelector("div");
let body = document.querySelector("body");
let mediaRecorder;
let chunks = [];
let isRecord = false;
let appliedFilter;
let min = 1;
let max = 3;
let filters = document.querySelectorAll(".filter");
let ziBtn = document.querySelector("#zoomin");
let ziDiv = ziBtn.querySelector("div");
let zoBtn = document.querySelector("#zoomout");
let zoDiv = zoBtn.querySelector("div");
let defZoom = 1;

ziBtn.addEventListener("click", function(){
    ziDiv.classList.add("zoom-anime");
    setTimeout(function() {
        ziDiv.classList.remove("zoom-anime");
    }, 1000);

    if (defZoom < max) {
        defZoom = defZoom + 0.2;
    }
    video.style.transform = `scale(${defZoom})`;
});

zoBtn.addEventListener("click", function(){
    zoDiv.classList.add("zoom-anime");
    setTimeout(function(){
        zoDiv.classList.remove("zoom-anime");
    }, 1000);

    if (defZoom > min) {
        defZoom = defZoom - 0.2;
    }
    video.style.transform = `scale(${defZoom})`;
});


for (let i = 0; i < filters.length; i++) {
    filters[i].addEventListener("click", function (e) {
        removeBgColor();
        // console.log(e.currentTarget.style.backgroundColor);
        appliedFilter = e.currentTarget.style.backgroundColor;
        console.log(appliedFilter);
        let div = document.createElement("div");
        div.style.backgroundColor = appliedFilter;
        div.classList.add("filter-div");

        body.append(div);
    });
}



// startBtn.addEventListener("click", function(){
//     mediaRecorder.start();
// });
// stopBtn.addEventListener("click", function(){
//     mediaRecorder.stop();
// });

recordBtn.addEventListener("click", function (e) {
    if (isRecord) {
        mediaRecorder.stop();
        isRecord = false;
        // e.currentTarget.innerText = "Start/Stop";
        recDiv.classList.remove("rec-anime");
    }
    else {
        mediaRecorder.start(); 
        appliedFilter = "";
        removeBgColor();
        // defZoom = 1;
        // video.style.transform = `scale(${defZoom})`;
        isRecord = true;
        // e.currentTarget.innerText = "Recording";
        recDiv.classList.add("rec-anime");
    }
})

capBtn.addEventListener("click", function () {

    if (isRecord) {
        return;
    }

    capDiv.classList.add("cap-anime");
    setTimeout(function () {
        capDiv.classList.remove("cap-anime");
    }, 1000);
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let tool = canvas.getContext("2d");

    tool.translate(canvas.width / 2, canvas.height / 2); // intersection point or the center of the video.
    tool.scale(defZoom, defZoom);
    tool.translate(-canvas.width / 2, -canvas.height / 2);  
    
    tool.drawImage(video, 0, 0);

    if (appliedFilter) {
        tool.fillStyle = appliedFilter;
        tool.fillRect(0, 0, canvas.width, canvas.height);
    }

    let link = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = link;
    a.download = "img.png";
    a.click();
    a.remove();
    canvas.remove();
});

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(function (mediaStream) {
        mediaRecorder = new MediaRecorder(mediaStream);

        mediaRecorder.addEventListener("dataavailable", function (e) {
            chunks.push(e.data);
        });

        mediaRecorder.addEventListener("stop", function (e) {
            let blob = new Blob(chunks, { type: "video/mp4" });
            chunks = [];
            let a = document.createElement("a");
            let url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = "video.mp4";
            a.click();
            a.remove();

            
        })
        video.srcObject = mediaStream;

    })
    .catch(function (error) {
        console.log(error);
    });

function removeBgColor() {
    let Color = document.querySelector(".filter-div");
    if (Color) {
        Color.remove();
    }
}
