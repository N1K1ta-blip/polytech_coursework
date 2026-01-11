const createTestData = () => {
    const results = JSON.parse(localStorage.getItem('game_results'))

    if(!results || !Array.isArray(results)) {
        localStorage.removeItem('game_results')
        localStorage.setItem('game_results', JSON.stringify([
            {
                fio: 'Иванов Иван',
                time: '5:20',
                levels: 3
            },
            {
                fio: 'Тест Тест',
                time: '9:20',
                levels: 2
            },
        ]))
    }
}

createTestData()