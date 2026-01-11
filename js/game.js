document.addEventListener('DOMContentLoaded', () => {
  const matryoshka = document.getElementById('matryoshka_start')
  const container = document.getElementById('gameStartPage')
  const exitBlock = document.getElementById('exitBlock')
  const startBlock = document.getElementById('startBlock')
  const autoButton = document.getElementById('autoButton')

  let position = container.clientWidth / 2
  const SPEED = 300
  let direction = 0
  let isAnimating = false
  let gameStarted = false
  let autoMode = false

  localStorage.setItem('autoMode', 'false')
  localStorage.setItem('gameTime', Date.now().toString())

  autoButton.addEventListener('click', (e) => {
    e.preventDefault()
    localStorage.setItem('autoMode', true)
    startAutoMode()
  });

  const animate = (currentTime) => {
    if (direction !== 0) {
      if (!animate.lastFrameTime) {
        animate.lastFrameTime = currentTime
      }
      const deltaTime = (currentTime - animate.lastFrameTime) / 1000
      position += direction * SPEED * deltaTime
      updatePosition(position)
      animate.lastFrameTime = currentTime
    } else {
      animate.lastFrameTime = null;
    }

    if (!gameStarted) {
      checkCollisions(startGame, startBlock, exitBlock)
    }

    if (direction !== 0) {
      requestAnimationFrame(animate)
    } else {
      isAnimating = false
    }
  }

  const startAnimation = () => {
    if (!isAnimating && direction !== 0) {
      isAnimating = true
      animate.lastFrameTime = null
      requestAnimationFrame(animate)
    }
  }

  const handleKeydown = (e) => {
    if (gameStarted || autoMode) return

    if (e.key === 'ArrowLeft') {
      direction = -1
      e.preventDefault()
    } else if (e.key === 'ArrowRight') {
      direction = 1
      e.preventDefault()
    } else {
      return
    }
    startAnimation()
  }

  const handleKeyup = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      direction = 0
      e.preventDefault()
    }
  }

  const startGame = () => {
    if (gameStarted) return
    gameStarted = true

    const startTime = Date.now()
    
    localStorage.setItem('gameTime', startTime.toString())

    window.location.href = './levels/firstLevel.html'
  }

  const startAutoMode = () => {
    if (gameStarted || autoMode) return
    const startRect = startBlock.getBoundingClientRect()

    const targetXWindow = startRect.left + startRect.width / 2

    autoMode = true
    direction = 0

    const moveTowardsTarget = () => {
      const nowRect = matryoshka.getBoundingClientRect()
      const nowX = nowRect.left + nowRect.width / 2
      const dist = targetXWindow - nowX

      position += Math.sign(dist) * 6;

      updatePosition(position)
      checkCollisions(startGame, startBlock, exitBlock)
      requestAnimationFrame(moveTowardsTarget)
    }

    moveTowardsTarget()
  }

  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('keyup', handleKeyup)

  updatePosition(position)
});