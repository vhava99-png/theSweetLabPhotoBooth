let video = document.getElementById("video")
let strip = document.getElementById("photos")
let counter = document.getElementById("countdown")
let retakeBtn = document.getElementById("retakeBtn")

let capturing=false
let isSessionActive=false
let retakeLeft=2

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

// SCREEN
function showScreen(id){
document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"))
document.getElementById(id).classList.add("active")
}

function setRandomCaption(){
  const random = captions[Math.floor(Math.random() * captions.length)]
  const el = document.getElementById("randomCaption")
  if(el){
    el.innerText = `"${random}"`
  }
}

function goInstruction(){
showScreen("instructionScreen")
}

function startSession(){
showScreen("cameraScreen")
startCamera()
resetSession()
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
