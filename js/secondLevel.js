document.addEventListener('DOMContentLoaded', () => {
    const matryoshka = document.getElementById('matryoshka_start')
    const container = document.getElementById('gameStartPage')
    const checkButton = document.getElementById('secondLevelCheckButton')
    const nextLevelBlock = document.getElementById('nextLevel')
    const autoButton = document.getElementById('autoButton')
    let lives = parseInt(localStorage.getItem('hearts'))
    let autoMode = false

    localStorage.setItem('autoMode', 'false')

    let isDragging = false
    let startX = 0
    let startY = 0
    let startLeft = 0
    let startTop = 0

    checkLocalStorage()

    updateHearts(lives)

    checkButton.addEventListener('click', () => {
        moveToTarget()
    })

    matryoshka.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return

        isDragging = true
        matryoshka.style.cursor = 'grabbing'
        matryoshka.style.pointerEvents = 'none'

        startX = e.clientX
        startY = e.clientY

        const computedStyle = getComputedStyle(matryoshka)
        startLeft = parseFloat(computedStyle.left) || 0
        startTop = parseFloat(computedStyle.top) || 0

        e.preventDefault()
    })

    autoButton.addEventListener('click', (e) => {
        e.preventDefault()
        localStorage.setItem('autoMode', true)
        autoMode = true
        moveToTarget()
    })

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return

        const dx = e.clientX - startX
        const dy = e.clientY - startY

        const newLeft = startLeft + dx
        const newTop = startTop + dy

        const containerRect = container.getBoundingClientRect()
        const matRect = matryoshka.getBoundingClientRect()

        const minX = containerRect.left
        const maxX = containerRect.right - matRect.width
        const minY = containerRect.top
        const maxY = containerRect.bottom - matRect.height

        const boundedLeft = Math.max(minX, Math.min(newLeft, maxX))
        const boundedTop = Math.max(minY, Math.min(newTop, maxY))

        matryoshka.style.transform = `translate(${boundedLeft - startLeft}px, ${boundedTop - startTop}px)`
    })

    const stopDrag = () => {
        if (!isDragging) return

        isDragging = false
        matryoshka.style.cursor = 'grab'
        matryoshka.style.pointerEvents = 'auto'

        const computedStyle = getComputedStyle(matryoshka)
        const currentTransform = computedStyle.transform
        if (currentTransform && currentTransform !== 'none') {
            const matrix = new DOMMatrixReadOnly(currentTransform)
            const finalLeft = startLeft + matrix.e
            const finalTop = startTop + matrix.f

            matryoshka.style.left = `${finalLeft}px`
            matryoshka.style.transform = 'none';

            startLeft = finalLeft
            startTop = finalTop
        }
    }

    const isCollidingWithFence = () => {
        const matRect = matryoshka.getBoundingClientRect()
        const fence = document.getElementById('fence')
        if (!fence) return false;

        const fenceRect = fence.getBoundingClientRect();

        return !(
            matRect.right < fenceRect.left ||
            matRect.left > fenceRect.right ||
            matRect.bottom < fenceRect.top ||
            matRect.top > fenceRect.bottom
        )
    }

    const moveToTarget = () => {
        const targetRect = nextLevelBlock.getBoundingClientRect()
        const targetX = targetRect.left + targetRect.width / 2
        const targetY = targetRect.top + targetRect.height / 2

        const move = () => {
            const matRect = matryoshka.getBoundingClientRect()
            const currentX = matRect.left + matRect.width / 2
            const currentY = matRect.top + matRect.height / 2

            const dx = targetX - currentX
            const dy = targetY - currentY
            const distance = Math.sqrt(dx * dx + dy * dy)

            checkCollisions(() => {
                localStorage.setItem('levels', '2')
                window.location.href = '../levels/thirdLevel.html'
            }, nextLevelBlock)

            if (!autoMode && isCollidingWithFence()) {
                lives--
                localStorage.setItem('hearts', lives.toString())
                updateHearts(lives)

                if (lives === 0) {
                    endGame(false, 'thirdLevel.html')
                    return
                }

                matryoshka.style.left = `200px`
                matryoshka.style.bottom = `0px`

                return
            }

            const newX = currentX + (dx / distance)

            matryoshka.style.left = `${newX + matRect.width / 2}px`

            requestAnimationFrame(move)
        }

        move()
    }

    document.addEventListener('mouseup', stopDrag)
    document.addEventListener('mouseleave', stopDrag)
})