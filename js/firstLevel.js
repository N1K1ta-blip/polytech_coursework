document.addEventListener('DOMContentLoaded', () => {
    const edibleItems = ['berry', 'mushroom']
    const allItems = ['leaf', 'berry', 'mushroom', 'staff', 'rocks']
    const itemsToCollect = 5
    let spawnInterval = 1200
    let fallDuration = 6000

    const gameArea = document.getElementById('gameStartPage')
    const description = document.getElementById('levelDescription')
    const matryoshka = document.getElementById('matryoshka_start')
    const container = document.getElementById('gameStartPage')
    const nextLevelButton = document.getElementById('nextLevelButton')

    let collected = 0
    let lives = parseInt(localStorage.getItem('hearts'))
    let autoMode = false
    let position = container.clientWidth / 2
    const SPEED = 500
    let direction = 0
    let isAnimating = false
    let isWon = false

    localStorage.setItem('autoMode', 'false')

    checkLocalStorage()

    updateHearts(lives)

    const loseLife = () => {
        lives--
        localStorage.setItem('hearts', lives.toString())
        updateHearts(lives)
        if (lives === 0) {
            endGame(false, 'secondLevel.html')
        }
    }

    const collectItem = () => {
        collected++
        if (collected === itemsToCollect) {
            confirmModal()
            isWon = true
        }
    }

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

    const createFallingItem = () => {
        const type = allItems[Math.floor(Math.random() * allItems.length)]
        const isEdible = edibleItems.includes(type)

        const item = document.createElement('div')
        item.className = 'falling-item'
        item.dataset.type = type
        item.style.backgroundImage = `url('../assents/${type}.png')`

        const minLeft = 50
        const itemWidth = 50
        const maxLeft = gameArea.clientWidth - 50 - itemWidth
        const safeMaxLeft = Math.max(minLeft, maxLeft)
        const leftPos = minLeft + Math.random() * (safeMaxLeft - minLeft)
        item.style.left = `${leftPos}px`
        item.style.top = '-60px'
        item.style.zIndex = 15

        gameArea.appendChild(item)

        let removed = false

        if (autoMode && isEdible && collected < itemsToCollect) {
            setTimeout(() => {
                if (!removed) {
                    removed = true;
                    item.remove();
                    collectItem();
                }
            }, 1000)
        }

        const startTime = Date.now()
        const animate = () => {
            if (removed) {
                return
            }

            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / fallDuration, 1)
            const currentTop = -60 + progress * (gameArea.clientHeight + 60)
            item.style.top = `${currentTop}px`

            if (!removed) {
                const matRect = matryoshka.getBoundingClientRect()
                const itemRect = item.getBoundingClientRect()
                if (isColliding(matRect, itemRect)) {
                    removed = true;
                    item.remove();
                    if (isEdible) {
                        collectItem()
                    } else {
                        if (!isWon) {
                            loseLife()
                        }
                    }
                }
            }

            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                if (!removed) {
                    if (isEdible) {
                        if (!isWon) {
                            loseLife()
                        }
                    }
                    item.remove()
                }
            }
        };

        requestAnimationFrame(animate)
    }

    setInterval(() => {
        createFallingItem()
    }, spawnInterval)

    const updateDescription = () => {
        description.textContent = `Собрано: ${collected} / ${itemsToCollect}`
        requestAnimationFrame(updateDescription)
    }

    const confirmModal = () => {
        const isNextLevel = confirm("Вы прошли первый уровень. Перейти на следующий уровень? Если захотите остаться на этом уровне, то для перехода дальше можно воспользоваться появившейся кнопкой")
        if (isNextLevel) {
            nextLevel()
        } else {
            nextLevelButton.style.display = 'block'
        }
    }

    const nextLevel = () => {
        localStorage.setItem('levels', '1')
        window.location.href = '../levels/secondLevel.html'
    }

    nextLevelButton.addEventListener('click', (e) => {
        e.preventDefault()
        nextLevel()
    })

    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('keyup', handleKeyup)

    updateDescription()
});