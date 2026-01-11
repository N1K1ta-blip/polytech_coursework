const form = document.getElementById('authForm')
const input = document.getElementById('fullName')
const button = document.getElementById('startButton')
const loader = document.getElementById('loader')
const startBlock = document.getElementById('startBlock')

function updateButtonState() {
    const value = input.value.trim()
    button.disabled = value === ''
}

input.addEventListener('input', updateButtonState)

document.getElementById('authForm').addEventListener('submit', (e) => {
    e.preventDefault()
    const name = input.value.trim()
    if (name) {
        loader.classList.remove('firstAnimation')
        startBlock.classList.remove('startAnimation')
        loader.classList.add('secondAnimation')
        startBlock.classList.add('endAnimation')
        localStorage.setItem('player_name', name)
        setTimeout(() => {
            window.location.href = './game.html'
        }, 1750)
    }
})