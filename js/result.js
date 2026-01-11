const downloadButton = document.getElementById('resultsBlock__buttons_download')
const table = document.getElementById('resultsBlock__table')
const noData = document.getElementById('noData')

document.getElementById('resultsBlock__buttons_download').addEventListener('click', (e) => {
    e.preventDefault()
    const filename = 'results.json'
    const data = localStorage.getItem('game_results')

    const blob = new Blob([data])

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    URL.revokeObjectURL(url)
})

const loadResults = () => {
    const results = JSON.parse(localStorage.getItem('game_results'))

    if (!results || !Array.isArray(results)) {
        downloadButton.style.display = 'none'
        table.style.display = 'none'
        noData.style.display = 'visible'
        return
    } else {
        downloadButton.style.display = 'visible'
        table.style.display = 'visible'
        noData.style.display = 'none'

        let html = `
            <thead>
                <tr>
                    <th scope="col">ФИО</th>
                    <th scope="col">Время</th>
                    <th scope="col">Пройдено уровней</th>
                </tr>
            </thead>
            <tbody>
        `

        results.forEach(element => {
            html += `
                <tr>
                    <th scope="row">${element.fio}</th>
                    <td>${element.time}</td>
                    <td>${element.levels}</td>
                </tr>
            `
        })

        html += `
            </tbody>
        `

        table.innerHTML = html
    }
}

loadResults()