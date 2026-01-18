const heartsContainer = document.getElementById('hearts')
const matryoshka = document.getElementById('matryoshka_start')
const container = document.getElementById('gameStartPage')

if (!localStorage.getItem('gameTime')) localStorage.setItem('gameTime', Date.now().toString())
if (!localStorage.getItem('hearts')) localStorage.setItem('hearts', '3')
if (!localStorage.getItem('levels')) localStorage.setItem('levels', '0')

const checkLocalStorage = () => {
    const fio = localStorage.getItem('player_name')
    const levels = localStorage.getItem('levels')
    const gameTime = localStorage.getItem('gameTime')

    if (!fio || !levels || !gameTime) {
        window.location.href = '../index.html'
    }
}

const isColliding = (rect1, rect2) => {
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

const checkCollisions = (successFunction, startBlock, exitBlock) => {
    const matRect = matryoshka.getBoundingClientRect()
    const startRect = startBlock.getBoundingClientRect()

    if (exitBlock) {
        const exitRect = exitBlock.getBoundingClientRect()
        if (isColliding(matRect, exitRect)) {
            window.location.href = 'index.html'
        }
    }

    if (isColliding(matRect, startRect)) {
        successFunction()
    }
}

const updatePosition = (position) => {
    const halfWidth = matryoshka.offsetWidth / 2
    const minX = halfWidth
    const maxX = container.clientWidth - halfWidth
    position = Math.max(minX, Math.min(maxX, position))

    matryoshka.style.left = `${position}px`
    matryoshka.style.transform = 'translateX(-50%)'
}

const updateHearts = (lives) => {
    if(lives < 0) {
        lives = 3
    }
    heartsContainer.innerHTML = ''
    for (let i = 0; i < lives; i++) {
        const heart = document.createElement('img')
        heart.src = '../assents/heart.png'
        heartsContainer.appendChild(heart)
    }
    for (let i = lives; i < 3; i++) {
        const heart = document.createElement('img')
        heart.src = '../assents/heart-outline.png'
        heartsContainer.appendChild(heart)
    }
}

const endGame = (isWin, nextLevel) => {
    if (isWin) {
        const fio = localStorage.getItem('player_name')
        const results = JSON.parse(localStorage.getItem('game_results'))

        if (fio) {
            const now = Date.now()
            const startTime = localStorage.getItem('gameTime')
            results.push({
                fio: fio,
                time: formatTime(Date.now() - startTime),
                levels: localStorage.getItem('levels')
            })
            localStorage.setItem('game_results', JSON.stringify(results))
        }
        alert('Игра пройдена!')
        localStorage.removeItem('gameTime')
        localStorage.removeItem('hearts')
        localStorage.removeItem('levels')
        localStorage.removeItem('player_name')
        window.location.href = nextLevel
    } else {
        const fio = localStorage.getItem('player_name')
        const results = JSON.parse(localStorage.getItem('game_results'))

        if (fio) {
            const now = Date.now()
            const startTime = localStorage.getItem('gameTime')
            results.push({
                fio: fio,
                time: formatTime(Date.now() - startTime),
                levels: localStorage.getItem('levels')
            })
            localStorage.setItem('game_results', JSON.stringify(results))
        }
        alert('Игра окончена! Все жизни потеряны.')
        localStorage.removeItem('gameTime')
        localStorage.removeItem('hearts')
        localStorage.removeItem('levels')
        localStorage.removeItem('player_name')
        window.location.href = '../index.html'
    }
}