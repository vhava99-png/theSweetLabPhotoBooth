let video = document.getElementById("video")
let strip = document.getElementById("photos")
let counter = document.getElementById("countdown")
let retakeBtn = document.getElementById("retakeBtn")

let capturing=false
let isSessionActive=false
let retakeLeft=2

let sessionTime = 180
let timerInterval = null

const MAX_PHOTOS=3
const captions = [
  "Life is sweeter with you 🍰",
  "Sweet moments, sweet memories",
  "Happiness is homemade",
  "Bite, smile, repeat 😄",
  "Sugar rush incoming!",
  "Dessert first, always",
  "Good vibes only ✨",
  "Made with love 💕",
  "Stay sweet!",
  "You look amazing today!"
]

const captions2 = [
  "Tag us @thesweetlab",
  "See you again!",
  "Bring your friends next time",
  "Sweet memories start here"
]

function startSessionTimer(){
  clearInterval(timerInterval)
  sessionTime = 12 // 3 menit
  updateTimerUI()
  timerInterval = setInterval(()=>{
    sessionTime--
    updateTimerUI()
    updateProgress() 
    if(sessionTime <= 0){
      clearInterval(timerInterval)
      alert("Waktu habis")
      stopSessionForce()
    }
  },1000)
}

function updateTimerUI(){
  const el = document.getElementById("sessionTimer")
  const min = Math.floor(sessionTime / 60).toString().padStart(2,'0')
  const sec = (sessionTime % 60).toString().padStart(2,'0')
  if(sessionTime <= 30){
  el.style.background = "rgba(231,76,60,0.9)"
}
  el.innerText = `${min}:${sec}`
}

function updateProgress(){

  const total = 12 // total detik
  const percent = (1 - sessionTime / total) * 100

  const top = document.getElementById("progressTop")
  const right = document.getElementById("progressRight")
  const bottom = document.getElementById("progressBottom")
  const left = document.getElementById("progressLeft")

  // tiap sisi 25%
  if(percent <= 25){
    top.style.width = percent * 4 + "%"
  }
  else if(percent <= 50){
    top.style.width = "100%"
    right.style.height = (percent - 25) * 4 + "%"
  }
  else if(percent <= 75){
    top.style.width = "100%"
    right.style.height = "100%"
    bottom.style.width = (percent - 50) * 4 + "%"
  }
  else{
    top.style.width = "100%"
    right.style.height = "100%"
    bottom.style.width = "100%"
    left.style.height = (percent - 75) * 4 + "%"
  }

  // 🎨 WARNA BERUBAH
  let color = "#2ecc71" // hijau

  if(percent > 60){
    color = "#e74c3c" // merah
  }
  else if(percent > 30){
    color = "#f39c12" // kuning/orange
  }

  top.style.background = color
  right.style.background = color
  bottom.style.background = color
  left.style.background = color
}

function stopSessionForce(){
  isSessionActive = false
  capturing = false
  counter.innerText = ""
  showScreen("startScreen")
}

function updateDateTime(){

  const el = document.getElementById("datetime")
  if(!el) return

  const now = new Date()

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ]

  const day = now.getDate()
  const month = months[now.getMonth()]
  const year = now.getFullYear()

  const hours = now.getHours().toString().padStart(2,'0')
  const mins = now.getMinutes().toString().padStart(2,'0')

  el.innerText = `${day} ${month} ${year} | ${hours}:${mins}`
}

// SCREEN
function showScreen(id){
document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"))
document.getElementById(id).classList.add("active")
}

function setRandomCaption(){

  const random = captions[Math.floor(Math.random() * captions.length)]
  const el1 = document.getElementById("randomCaption")

  if(el1){
    el1.innerText = random
  }

  const random2 = captions2[Math.floor(Math.random() * captions2.length)]
  const el2 = document.getElementById("randomCaption2")

  if(el2){
    el2.innerText = random2
  }

}

function goInstruction(){
showScreen("instructionScreen")
}

function startSession(){
showScreen("cameraScreen")
startCamera()
resetSession()
 updateRetakeUI()
 updateDateTime()
 startSessionTimer()   // 🔥 TIMER MULAI
  setTimeout(()=>{
    startCapture()
  }, 500) // kasih delay biar camera ready
}

// CAMERA
async function startCamera(){
const stream=await navigator.mediaDevices.getUserMedia({video:true})
video.srcObject=stream
}

// RESET
function resetSession(){
retakeLeft=2
updateRetakeUI()
strip.innerHTML=""
isSessionActive=false
updateDateTime()
}

// CAPTURE
async function startCapture(){

if(capturing) return

capturing=true
isSessionActive=true
setRandomCaption() 
strip.innerHTML=""

for(let i=0;i<MAX_PHOTOS;i++){

if(!isSessionActive) break

await countdown(7)

if(!isSessionActive) break

let canvas=document.createElement("canvas")
canvas.width=video.videoWidth
canvas.height=video.videoHeight

canvas.getContext("2d").drawImage(video,0,0)

let img=canvas.toDataURL()

let image=document.createElement("img")
image.src=img
strip.appendChild(image)

flash()
}

capturing=false
}

// FLASH
function flash(){
let f=document.createElement("div")
f.style.position="fixed"
f.style.top=0
f.style.left=0
f.style.width="100%"
f.style.height="100%"
f.style.background="white"
f.style.zIndex=9999
document.body.appendChild(f)
setTimeout(()=>f.remove(),120)
}

// RETAKE
function retake(){

if(retakeLeft<=0){
alert("Kesempatan habis")
return
}

retakeLeft--
updateRetakeUI()
startCapture()
}

function updateRetakeUI(){
retakeBtn.innerText="🔁 Coba Lagi ("+retakeLeft+")"
}

// PRINT
function printStrip(){
if(!confirm("Sudah puas?")) return
    window.print()
}

// STOP (FIXED TOTAL)
function stopSession(){

if(!confirm("Yakin berhenti?")) return

isSessionActive=false
capturing=false
counter.innerText=""
clearInterval(timerInterval)
sessionTime = 180
document.getElementById("sessionTimer").innerText = "05:00"
document.getElementById("progressTop").style.width = "0%"
document.getElementById("progressRight").style.height = "0%"
document.getElementById("progressBottom").style.width = "0%"
document.getElementById("progressLeft").style.height = "0%"

showScreen("startScreen")
}

// COUNTDOWN (STOP SAFE)
function countdown(sec){

return new Promise(resolve=>{

let i=sec
counter.innerText=i

let timer=setInterval(()=>{

if(!isSessionActive){
clearInterval(timer)
counter.innerText=""
resolve()
return
}

i--
counter.innerText=i

if(i<=0){
clearInterval(timer)
counter.innerText=""
resolve()
}

},1000)

})
}
