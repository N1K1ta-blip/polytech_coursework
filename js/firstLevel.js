document.addEventListener('DOMContentLoaded', () => {
    const edibleItems = ['berry', 'mushroom']
    const allItems = ['leaf', 'berry', 'mushroom', 'staff', 'rocks']
    const itemsToCollect = 5
    let spawnInterval = 1200
    let fallDuration = 6000

    const gameArea = document.getElementById('gameStartPage')
    const description = document.getElementById('levelDescription')
    const nextLevelBlock = document.getElementById('nextLevel')
    const matryoshka = document.getElementById('matryoshka_start')
    const container = document.getElementById('gameStartPage')
    const autoButton = document.getElementById('autoButton')

    let collected = 0
    let position = container.clientWidth / 2
    let lives = parseInt(localStorage.getItem('hearts'))
    let autoMode = false

    localStorage.setItem('autoMode', 'false')

    checkLocalStorage()

    updateHearts(lives)

    autoButton.addEventListener('click', (e) => {
        e.preventDefault()
        localStorage.setItem('autoMode', true)
        autoMode = true
        spawnInterval = 1000
        fallDuration = 3000
    });

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
        if (collected >= itemsToCollect) {
            nextLevel()
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

        if (autoMode && isEdible) {
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

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (!removed) {
                    if (isEdible) {
                        loseLife()
                    }
                    item.remove()
                }
            }
        };

        requestAnimationFrame(animate)

        item.addEventListener('click', () => {
            removed = true
            item.remove()

            if (isEdible) {
                collectItem()
            } else {
                loseLife()
            }
        });
    }

    setInterval(() => {
        createFallingItem()
    }, spawnInterval)

    const updateDescription = () => {
        description.textContent = `Собрано: ${collected} / ${itemsToCollect}`
        requestAnimationFrame(updateDescription)
    }

    const nextLevel = () => {
        gameWon = true
        const startRect = nextLevelBlock.getBoundingClientRect()

        const targetXWindow = startRect.left + startRect.width / 2

        const moveTowardsTarget = () => {
            const nowRect = matryoshka.getBoundingClientRect()
            const nowX = nowRect.left + nowRect.width / 2
            const dist = targetXWindow - nowX

            position += Math.sign(dist) * 6;

            updatePosition(position)
            checkCollisions(() => {
                localStorage.setItem('levels', '1')
                window.location.href = '../levels/secondLevel.html'
            }, nextLevelBlock)
            requestAnimationFrame(moveTowardsTarget)
        }

        moveTowardsTarget()
    }

    updateDescription()
});