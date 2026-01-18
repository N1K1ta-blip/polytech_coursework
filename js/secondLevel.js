document.addEventListener('DOMContentLoaded', () => {
    const matryoshka = document.getElementById('matryoshka_start')
    const container = document.getElementById('gameStartPage')
    const fence = document.getElementById('fence')
    const nextLevelBlock = document.getElementById('nextLevel')
    let lives = parseInt(localStorage.getItem('hearts'))
    const description = document.getElementById('levelDescription')
    const nextLevelButton = document.getElementById('nextLevelButton')

    localStorage.setItem('autoMode', 'false')

    const itemsToCollect = 3
    let isDragging = false
    let startX = 0
    let startY = 0
    let startLeft = 0
    let startTop = 0
    let collected = 0
    let isWon = false

    checkLocalStorage()

    updateHearts(lives)

    const randomizeFence = () => {
        const minWidth = 150
        const maxWidth = 350
        const minHeight = 100
        const maxHeight = 300

        const width = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth
        const height = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight

        fence.style.width = `${width}px`
        fence.style.height = `${height}px`
    }

    const isInsideNextLevel = () => {
        const matRect = matryoshka.getBoundingClientRect()
        const targetRect = nextLevelBlock.getBoundingClientRect()

        return !(
            matRect.right < targetRect.left ||
            matRect.left > targetRect.right ||
            matRect.bottom < targetRect.top ||
            matRect.top > targetRect.bottom
        );
    }

    const loseLife = () => {
        lives--
        localStorage.setItem('hearts', lives.toString())
        updateHearts(lives)
        if (lives === 0) {
            endGame(false, 'secondLevel.html')
        }
    }

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

        if (!isCollidingWithFence()) {
            matryoshka.style.transform = `translate(${boundedLeft - startLeft}px, ${boundedTop - startTop}px)`
        } else {
            resetMatryoshka()
            if (!isWon) {
                loseLife()
            }
            isDragging = false
            matryoshka.style.cursor = 'grab'
            matryoshka.style.pointerEvents = 'auto'
            matryoshka.style.transform = 'none'
        }

        if (isInsideNextLevel()) {
            collected++
            if (collected === itemsToCollect) {
                confirmModal()
                isWon = true
            }
            resetMatryoshka()
            randomizeFence()
            isDragging = false
            matryoshka.style.cursor = 'grab'
            matryoshka.style.pointerEvents = 'auto'
            matryoshka.style.transform = 'none'
        }

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
        if (!fence) return false;

        const fenceRect = fence.getBoundingClientRect();

        return !(
            matRect.right < fenceRect.left ||
            matRect.left > fenceRect.right ||
            matRect.bottom < fenceRect.top ||
            matRect.top > fenceRect.bottom
        )
    }

    const resetMatryoshka = () => {
        const containerRect = container.getBoundingClientRect()
        const matRect = matryoshka.getBoundingClientRect()
        const left = containerRect.left + 20
        const top = containerRect.bottom - matRect.height - 10

        matryoshka.style.left = `${left}px`
        matryoshka.style.top = `${top}px`
        matryoshka.style.transform = 'none'

        startLeft = left
        startTop = top
    }

    const updateDescription = () => {
        description.textContent = `Заборов пройдено: ${collected} / ${itemsToCollect}`
        requestAnimationFrame(updateDescription)
    }

    const confirmModal = () => {
        const isNextLevel = confirm("Вы прошли второй уровень. Перейти на следующий уровень? Если захотите остаться на этом уровне, то для перехода дальше можно воспользоваться появившейся кнопкой")
        if (isNextLevel) {
            nextLevel()
        } else {
            nextLevelButton.style.display = 'block'
        }
    }

    const nextLevel = () => {
        localStorage.setItem('levels', '2')
        window.location.href = './thirdLevel.html'
    }

    nextLevelButton.addEventListener('click', (e) => {
        e.preventDefault()
        nextLevel()
    })

    document.addEventListener('mouseup', stopDrag)
    document.addEventListener('mouseleave', stopDrag)
    randomizeFence()
    resetMatryoshka()
    updateDescription()
})