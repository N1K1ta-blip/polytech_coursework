const timer = document.getElementById('timer')

let startTime = localStorage.getItem('gameTime')
if (!startTime) {
    startTime = Date.now()
    localStorage.setItem('gameStartTime', startTime.toString())
} else {
    startTime = parseInt(startTime, 10)
}

const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
    const seconds = (totalSeconds % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
}

const updateTimer = () => {
    const now = Date.now()
    const elapsed = now - startTime
    timer.textContent = formatTime(elapsed)

    requestAnimationFrame(updateTimer);
}

updateTimer()
