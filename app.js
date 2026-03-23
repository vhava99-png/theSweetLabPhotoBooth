let video = document.getElementById("video")
let countdownEl = document.getElementById("countdown")
let strip = document.getElementById("strip")

let photos = []
let retriesLeft = 2

// SCREEN SWITCH
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"))
  document.getElementById(id).classList.add("active")
}

// NAVIGATION
function goInstruction(){
  showScreen("instructionScreen")
}

function startSession(){
  showScreen("cameraScreen")
  startCamera()
}

// CAMERA
async function startCamera(){
  const stream = await navigator.mediaDevices.getUserMedia({video:true})
  video.srcObject = stream
}

// CAPTURE
async function startCapture(){

  photos = []
  strip.innerHTML = ""

  for(let i=0;i<3;i++){

    await countdown()

    let canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext("2d").drawImage(video,0,0)

    let img = canvas.toDataURL("image/png")
    photos.push(img)

    let image = document.createElement("img")
    image.src = img
    image.style.width = "100%"
    strip.appendChild(image)
  }
}

// COUNTDOWN 7 DETIK
async function countdown(){
  for(let i=7;i>0;i--){
    countdownEl.innerText = i

    if(i<=3){
      beep()
    }

    await delay(1000)
  }

  countdownEl.innerText = ""
}

// BEEP
function beep(){
  const ctx = new (window.AudioContext||window.webkitAudioContext)()
  const osc = ctx.createOscillator()
  osc.connect(ctx.destination)
  osc.frequency.value = 800
  osc.start()
  osc.stop(ctx.currentTime+0.2)
}

// RETRY
function retake(){
  if(retriesLeft<=0){
    alert("Kesempatan habis")
    return
  }

  retriesLeft--
  startCapture()
}

// PRINT
function printStrip(){
  const confirmPrint = confirm("Apakah kamu sudah puas dengan hasilnya?")
  if(!confirmPrint) return

  window.print()
}

// STOP
function stopSession(){
  const c = confirm("Apakah kamu yakin ingin berhenti?")
  if(c){
    showScreen("startScreen")
  }
}

// DELAY
function delay(ms){
  return new Promise(r=>setTimeout(r,ms))
}
