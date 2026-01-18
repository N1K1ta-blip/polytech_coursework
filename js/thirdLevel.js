document.addEventListener('DOMContentLoaded', () => {
    const sistersClassNames = [
        'matryoshka_sister_1',
        'matryoshka_sister_2',
        'matryoshka_sister_3'
    ]
    const description = document.getElementById('levelDescription')
    const road = document.getElementById('matryoshka_sisters')
    const nextLevelButton = document.getElementById('nextLevelButton')

    const TOTAL_SISTERS = 3
    const MIN_VISIBLE_TIME = 3000
    const MAX_VISIBLE_TIME = 4000
    let collected = 0
    let activeSisters = []
    let lives = parseInt(localStorage.getItem('hearts')) || 3
    let isWon = false

    checkLocalStorage()

    updateHearts(lives)

    const createSister = () => {
        const sister = document.createElement('div')
        const randomClass = sistersClassNames[Math.floor(Math.random() * sistersClassNames.length)]
        sister.className = randomClass

        const roadRect = road.getBoundingClientRect()

        const maxX = roadRect.width - 60
        const maxY = roadRect.height - 90
        const x = Math.max(0, Math.random() * maxX)
        const y = Math.max(0, Math.random() * maxY)

        sister.style.left = `${x}px`
        sister.style.top = `${y}px`

        road.appendChild(sister)
        activeSisters.push(sister)

        sister.addEventListener('dblclick', () => {
            collectSister(sister)
        });

        const visibleTime = Math.random() * (MAX_VISIBLE_TIME - MIN_VISIBLE_TIME) + MIN_VISIBLE_TIME
        setTimeout(() => {
            if (sister.parentNode) {
                if (!isWon) {
                    loseLife()
                }
                road.removeChild(sister)
                activeSisters = activeSisters.filter(s => s !== sister)
            }
        }, visibleTime)
    }

    const collectSister = (sister) => {
        if (sister.parentNode) {
            road.removeChild(sister)
            activeSisters = activeSisters.filter(s => s !== sister)
            collected++
            checkWin()
        }
    }

    const loseLife = () => {
        lives--
        localStorage.setItem('hearts', lives.toString())
        updateHearts(lives)
        if (lives === 0) {
            endGame(false, 'thirdLevel.html')
        }
    }

    const checkWin = () => {
        if (collected === TOTAL_SISTERS) {
            isWon = true
            confirmModal()
        }
    }

    const confirmModal = () => {
        const isNextLevel = confirm("Вы прошли третий уровень. Законсить игру? Если захотите остаться на этом уровне, то для перехода дальше можно воспользоваться появившейся кнопкой")
        if (isNextLevel) {
            nextLevel()
        } else {
            nextLevelButton.style.display = 'block'
        }
    }

    const nextLevel = () => {
        localStorage.setItem('levels', '3')
        endGame(true, '../index.html')
    }

    const updateDescription = () => {
        description.textContent = `Собрано: ${collected} / ${TOTAL_SISTERS}`
        requestAnimationFrame(updateDescription)
    }

    for (let i = 0; i < TOTAL_SISTERS; i++) {
        setTimeout(() => createSister(), i * 800)
    }

    const spawnInterval = setInterval(() => {
        while (activeSisters.length < TOTAL_SISTERS && (!isWon ? collected : 0) + activeSisters.length < TOTAL_SISTERS) {
            createSister()
        }
    }, 1500)

    nextLevelButton.addEventListener('click', (e) => {
        e.preventDefault()
        nextLevel()
    })
    
    updateDescription()
});