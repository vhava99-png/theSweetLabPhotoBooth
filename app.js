const video = document.getElementById("video")
const strip = document.getElementById("photos")
const counter = document.getElementById("countdown")

let photos = []
let capturing = false
let retakeCount = 0

const MAX_PHOTOS = 3        // ✅ sesuai requirement kamu
const MAX_RETAKE = 2

// 🎥 CAMERA
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
  video.srcObject = stream
})
.catch(() => {
  alert("Camera tidak tersedia")
})

// ⏱ INIT TIME
updateDateTime()

// 📸 START CAPTURE
async function startCapture(){

  if(capturing) return

  capturing = true
  photos = []
  strip.innerHTML = ""

  updateDateTime()

  for(let i=0; i<MAX_PHOTOS; i++){

    await countdown(7) // ✅ 7 detik

    const img = capture()

    photos.push(img)

    addPreview(img)

    await delay(500)
  }

  capturing = false
}

// 📷 CAPTURE IMAGE
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

// ⚡ FLASH EFFECT
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

  setTimeout(() => {
    flash.remove()
  }, 120)
}

// ➕ ADD PREVIEW
function addPreview(photo){

  const img = document.createElement("img")
  img.src = photo

  strip.appendChild(img)
}

// 🔁 RETAKE
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

// 🖨 PRINT
function printStrip(){

  const confirmPrint = confirm("Apakah kamu sudah puas dengan hasilnya?")
  if(!confirmPrint) return

  setRandomCaption()

  setTimeout(() => {
    window.print()
  }, 300)
}

// ⏱ COUNTDOWN (7 DETIK + BEEP)
function countdown(sec){

  return new Promise(resolve => {

    let i = sec
    counter.innerText = i

    const timer = setInterval(() => {

      i--

      counter.innerText = i

      // 🔊 beep di 3 detik terakhir
      if(i <= 3 && i > 0){
        beep()
      }

      if(i <= 0){
        clearInterval(timer)
        counter.innerText = ""
        resolve()
      }

    }, 1000)

  })

}

// 🔊 BEEP SOUND
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
  const random = captions[Math.floor(Math.random() * captions.length)]
  const el = document.getElementById("randomCaption")
  if(el){
    el.innerText = `"${random}"`
  }
}

// 🕒 DATETIME
function updateDateTime(){

  const el = document.getElementById("datetime")
  if(!el) return

  const now = new Date()

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ]

  const month = months[now.getMonth()]
  const year = now.getFullYear()

  const hours = now.getHours().toString().padStart(2,'0')
  const mins = now.getMinutes().toString().padStart(2,'0')

  el.innerText = `${month} ${year}  |  ${hours}:${mins}`
}

// ⏳ DELAY
function delay(ms){
  return new Promise(res => setTimeout(res, ms))
}
