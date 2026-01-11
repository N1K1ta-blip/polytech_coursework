document.addEventListener('DOMContentLoaded', () => {
    const sisters = [
        document.getElementById('matryoshka_sister_1'),
        document.getElementById('matryoshka_sister_2'),
        document.getElementById('matryoshka_sister_3')
    ]
    const checkButton = document.getElementById('thirdLevelCheckButton')
    const autoButton = document.getElementById('autoButton')

    let rotations = [0, 0, 0]
    let lives = parseInt(localStorage.getItem('hearts')) || 3

    localStorage.setItem('autoMode', 'false')

    checkLocalStorage()

    updateHearts(lives)

    const setRotation = (index, angle) => {
        rotations[index] = angle % 360
        sisters[index].style.transform = `rotate(${rotations[index]}deg)`
    }

    const initRandomRotations = () => {
        const angles = [90, 180, 270]
        sisters.forEach((_, i) => {
            const randomAngle = angles[Math.floor(Math.random() * angles.length)]
            setRotation(i, randomAngle)
        });
    }

    sisters.forEach((sister, i) => {
        sister.addEventListener('click', () => {
            setRotation(i, rotations[i] + 90)
        })
    })

    const checkRotations = () => {
        return rotations.every(angle => angle % 360 === 0)
    }

    const loseLife = () => {
        lives--
        localStorage.setItem('hearts', lives.toString())
        updateHearts(lives)

        if (lives === 0) {
            endGame(false, 'index.html')
            return
        }
    }

    checkButton.addEventListener('click', () => {

        if (checkRotations()) {
            localStorage.setItem('levels', '3')            
            endGame(true, '../index.html')
        } else {
            loseLife()
        }
    })

    autoButton.addEventListener('click', (e) => {
        e.preventDefault()
        sisters.forEach((_, i) => {
            setRotation(i, 0)
        })
        setTimeout(() => {
            localStorage.setItem('levels', '3')
            endGame(true, '../index.html')
        }, 1500)
    })

    initRandomRotations()
});