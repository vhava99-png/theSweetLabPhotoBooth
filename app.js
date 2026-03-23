let sessionTime = 300
let sessionTimer

// SCREEN SWITCH
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"))
  document.getElementById(id).classList.add("active")
}

// SIMULASI PAYMENT
function fakePayment(){
  showScreen("instructionScreen")
  startSessionTimer()
}

// TIMER 5 MENIT
function startSessionTimer(){
  sessionTime = 300

  sessionTimer = setInterval(()=>{
    sessionTime--
    if(sessionTime <= 0){
      alert("Waktu habis")
      endSession()
    }
  },1000)
}

// START SESSION
async function startSession(){
  showScreen("cameraScreen")
  await startCamera()
  startCapture()
}

// START CAMERA
async function startCamera(){
  const stream = await navigator.mediaDevices.getUserMedia({video:true})
  document.getElementById("video").srcObject = stream
}

// CAPTURE FLOW
async function startCapture(){

  for(let i=0;i<3;i++){
    await runCountdown()
    flashEffect()

    console.log("Photo taken", i+1)

    await delay(1000)
  }

  alert("Selesai!")
  endSession()
}

// ⏱ COUNTDOWN 7 DETIK + BEEP DI 3 DETIK TERAKHIR
async function runCountdown(){
  const el = document.getElementById("countdown")

  for(let i=7;i>0;i--){
    el.innerText = i

    // 🔊 bunyi di 3 detik terakhir
    if(i <= 3){
      playBeep()
    }

    await delay(1000)
  }

  el.innerText = ""
}

// 🔊 SOUND BEEP
function playBeep(){
  const ctx = new (window.AudioContext || window.webkitAudioContext)()

  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.type = "sine"
  oscillator.frequency.setValueAtTime(800, ctx.currentTime)

  oscillator.connect(gain)
  gain.connect(ctx.destination)

  oscillator.start()
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2)

  oscillator.stop(ctx.currentTime + 0.2)
}

// FLASH EFFECT
function flashEffect(){
  const flash = document.createElement("div")
  flash.style.position = "fixed"
  flash.style.top = 0
  flash.style.left = 0
  flash.style.width = "100%"
  flash.style.height = "100%"
  flash.style.background = "white"
  document.body.appendChild(flash)

  setTimeout(()=>flash.remove(),100)
}

// STOP BUTTON
document.getElementById("stopBtn").addEventListener("click", ()=>{
  const confirmStop = confirm("Apakah kamu yakin ingin berhenti?")
  if(confirmStop){
    endSession()
  }
})

// END SESSION
function endSession(){
  clearInterval(sessionTimer)
  showScreen("qrScreen")
}

// HELPER
function delay(ms){
  return new Promise(r=>setTimeout(r,ms))
}

// 🎮 BLUETOOTH BUTTON (VOLUME)
document.addEventListener("keydown", function(e){
  if(e.key === "VolumeUp" || e.key === "VolumeDown" || e.keyCode === 24 || e.keyCode === 25){
    fakePayment()
  }
})