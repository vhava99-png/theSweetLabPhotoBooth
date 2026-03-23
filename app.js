let video = document.getElementById("video")
let photosDiv = document.getElementById("photos")
let countdownEl = document.getElementById("countdown")

let photos = []
let retriesLeft = 2

// 🎥 START CAMERA
navigator.mediaDevices.getUserMedia({video:true})
.then(stream=>{
video.srcObject = stream
})

// 🎲 RANDOM CAPTION
const captions = [
"Life is sweeter with you 🍰",
"Sweet moments, sweet memories",
"Happiness is homemade",
"Bite, smile, repeat 😄",
"Sugar rush incoming!",
"Dessert first, always",
"Good vibes & good bites",
"Made with love 💕",
"Stay sweet!",
"Sweet day, sweet life"
]

function setRandomCaption(){
const random = captions[Math.floor(Math.random()*captions.length)]
document.getElementById("randomCaption").innerText = `"${random}"`
}

// ⏱ COUNTDOWN 7 DETIK
async function countdown(){
for(let i=7;i>0;i--){
countdownEl.innerText = i

if(i<=3){
beep()
}

await delay(1000)
}
countdownEl.innerText=""
}

// 🔊 BEEP
function beep(){
const ctx = new (window.AudioContext||window.webkitAudioContext)()
const osc = ctx.createOscillator()
const gain = ctx.createGain()

osc.connect(gain)
gain.connect(ctx.destination)

osc.frequency.value = 800
osc.start()

gain.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.2)
osc.stop(ctx.currentTime+0.2)
}

// 📸 CAPTURE
async function startCapture(){

photos=[]
photosDiv.innerHTML=""

for(let i=0;i<3;i++){

await countdown()

let canvas=document.createElement("canvas")
canvas.width=video.videoWidth
canvas.height=video.videoHeight
canvas.getContext("2d").drawImage(video,0,0)

let img=canvas.toDataURL("image/png")
photos.push(img)

let image=document.createElement("img")
image.src=img
photosDiv.appendChild(image)

await delay(500)
}
}

// 🔁 RETAKE
function retake(){

if(retriesLeft<=0){
alert("Kesempatan habis")
return
}

retriesLeft--
startCapture()
}

// 🖨 PRINT
function printStrip(){

const confirmPrint = confirm("Apakah kamu sudah puas dengan hasilnya?")
if(!confirmPrint) return

setRandomCaption()

setTimeout(()=>{
window.print()
},300)
}

// 🕒 TIME
function updateTime(){
let now = new Date()
document.getElementById("datetime").innerText = now.toLocaleString()
}
setInterval(updateTime,1000)

// ⏳ DELAY
function delay(ms){
return new Promise(res=>setTimeout(res,ms))
}
