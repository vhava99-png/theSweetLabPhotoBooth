const video = document.getElementById("video")
const strip = document.getElementById("photos")
const counter = document.getElementById("countdown")

let photos = []
let capturing = false
let retakeCount = 0
let isSessionActive = false

const MAX_PHOTOS = 3
const MAX_RETAKE = 2

// =======================
// 🎥 CAMERA
// =======================
async function startCamera(){
  try{
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    video.srcObject = stream
  }catch(e){
    alert("Camera tidak tersedia")
  }
}

// =======================
// 📺 SCREEN CONTROL
// =======================
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>{
    s.classList.remove("active")
  })

  const target = document.getElementById(id)
  if(target){
    target.classList.add("active")
  }
}

// =======================
// ▶️ START SESSION
// =======================
function startSession(){
  showScreen("cameraScreen")
  startCamera()
}

// =======================
// 📸 CAPTURE FLOW
// =======================
async function startCapture(){

  if(capturing) return

  capturing = true
  isSessionActive = true

  photos = []
  strip.innerHTML = ""
  updateDateTime()

  for(let i=0;i<MAX_PHOTOS;i++){

    if(!isSessionActive) break

    await countdown(7)

    if(!isSessionActive) break

    const img = capture()

    photos.push(img)
    addPreview(img)

    await delay(500)
  }

  capturing = false
}

// =======================
// 📷 CAPTURE IMAGE
// =======================
function capture(){

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  const w = video.videoWidth
  const h = video.videoHeight

  canvas.width = w
  canvas.height = h

  ctx.filter = "grayscale(100%) contrast(135%) brightness(135%)"

  const scale = 0.9
  const nw = w * scale
  const nh = h * scale

  const offsetX = (w - nw) / 2
  const offsetY = (h - nh) / 2

  ctx.drawImage(video, offsetX, offsetY, nw, nh)

  flash()

  return canvas.toDataURL("image/png")
}

// =======================
// ⚡ FLASH
// =======================
function flash(){

  const flash = document.createElement("div")

  flash.style.position = "fixed"
  flash.style.top = "0"
  flash.style.left = "0"
  flash.style.width = "100%"
  flash.style.height = "100%"
  flash.style.background = "white"
  flash.style.opacity = "0.9"
  flash.style.zIndex = "9999"

  document.body.appendChild(flash)

  setTimeout(()=>flash.remove(),120)
}

// =======================
// ➕ PREVIEW
// =======================
function addPreview(photo){

  const img = document.createElement("img")
  img.src = photo

  strip.appendChild(img)
}

// =======================
// 🔁 RETAKE
// =======================
function retake(){

  if(retakeCount >= MAX_RETAKE){
    alert("Kesempatan coba lagi habis")
    return
  }

  retakeCount++

  photos = []
  strip.innerHTML = ""

  startCapture()
}

// =======================
// 🖨 PRINT (FIXED)
// =======================
function printStrip(){

  const confirmPrint = confirm("Apakah kamu sudah puas dengan hasilnya?")
  if(!confirmPrint) return

  setRandomCaption()

  setTimeout(()=>{
    window.print()
  },300)
}

// =======================
// ⏱ COUNTDOWN (STOP SAFE)
// =======================
function countdown(sec){

  return new Promise(resolve=>{

    let i = sec
    counter.innerText = i

    const timer = setInterval(()=>{

      if(!isSessionActive){
        clearInterval(timer)
        counter.innerText = ""
        resolve()
        return
      }

      i--
      counter.innerText = i

      if(i <= 3 && i > 0){
        beep()
      }

      if(i <= 0){
        clearInterval(timer)
        counter.innerText = ""
        resolve()
      }

    },1000)

  })

}

// =======================
// 🔊 BEEP
// =======================
function beep(){

  const ctx = new (window.AudioContext || window.webkitAudioContext)()

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.frequency.value = 800
  osc.start()

  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2)

  osc.stop(ctx.currentTime + 0.2)
}

// =======================
// ⛔ STOP SESSION (FIXED)
// =======================
function stopSession(){

  const confirmStop = confirm("Apakah kamu yakin ingin berhenti?")
  if(!confirmStop) return

  isSessionActive = false
  capturing = false

  counter.innerText = ""

  showScreen("startScreen")
}

// =======================
// 🎲 RANDOM CAPTION
// =======================
const captions = [
"Life is sweeter with you 🍰",
"Sweet moments, sweet memories",
"Happiness is homemade",
"Bite, smile, repeat 😄",
"Sugar rush incoming!",
"Dessert first, always",
"Good vibes & good bites",
"Made with love 💕"
]

function setRandomCaption(){
  const random = captions[Math.floor(Math.random()*captions.length)]
  const el = document.getElementById("randomCaption")
  if(el){
    el.innerText = `"${random}"`
  }
}

// =======================
// 🕒 TIME
// =======================
function updateDateTime(){

  const el = document.getElementById("datetime")
  if(!el) return

  const now = new Date()

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  const month = months[now.getMonth()]
  const year = now.getFullYear()

  const hours = now.getHours().toString().padStart(2,'0')
  const mins = now.getMinutes().toString().padStart(2,'0')

  el.innerText = `${month} ${year} | ${hours}:${mins}`
}

// =======================
// ⏳ DELAY
// =======================
function delay(ms){
  return new Promise(res=>setTimeout(res,ms))
}
