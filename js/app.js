const body = document.querySelector('body')
const gameBoard = document.querySelector('#gameBoard')
const menuSection = document.querySelector('.menuSection')
const scoreSection = document.querySelector('.scoreSectionOverlay')
const playersSection = document.querySelector('#players')
const menuForm = document.querySelector('#menu')
const winner = document.querySelector('#winner')

///BUTTONY
const startGameBtn = document.querySelector('#startGameBtn')
const newGameBtns = document.querySelectorAll('.newGameBtn')
const restartGameBtns = document.querySelectorAll('.restartBtn')

///Zmienne
const players = []
const virtualBoard = []
let winners = []
let numberOfPlayers = 0
let gridSize = 0


const renderPlayers = (playersTiles,activePlayer) => {
    playersTiles.forEach((tile,index) => {
        tile.classList.remove('active-player')

        if(index === activePlayer){
            tile.querySelector('p').innerText = players[activePlayer].points
            tile.classList.add('active-player')
        }
    });
}

const renderTile = (tiles) => {
    virtualBoard.forEach((virtualTile,index) => {
        if(virtualTile.visibility){
            tiles[index].textContent = virtualTile.number
        }else{
            tiles[index].textContent = ''
        }
    })
}

const game = () => {
    const tiles = document.querySelectorAll('.tile')
    const playersTiles = document.querySelectorAll('.player-tile')

    let activePlayer = 0
    const selectedCouple = []

    renderPlayers(playersTiles,activePlayer)

    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => {
            if(virtualBoard[index].visibility === false){
                virtualBoard[index].visibility = true
                selectedCouple.push(virtualBoard[index])

                if(selectedCouple.length <= 2){
                    renderTile(tiles)
                    if(selectedCouple.length === 2){
                        if(selectedCouple[0].number === selectedCouple[1].number){
                            players[activePlayer].points = players[activePlayer].points + 1
                            renderPlayers(playersTiles,activePlayer)
                            checkStatus()   
                        }else{
                            selectedCouple.forEach(tile => tile.visibility = false)
                            setTimeout(() => {
                                renderTile(tiles)
                                renderPlayers(playersTiles,activePlayer)   
                            },500)
                            activePlayer++
                            activePlayer === players.length ? activePlayer = 0 : null
                        }
                        selectedCouple.length = 0
                    }
                }
            }
        })
    })
}

const createPlayers = (numberOfPlayers) => {
    for(i = 0; i<numberOfPlayers; i++){
        const player = {
            playerNumber: i+1,
            points: 0
        }

        players.push(player)
        const playerTile = document.createElement('div')
        playerTile.classList.add('player-tile')
        const playerNumber = document.createElement('span')
        playerNumber.innerText = `Player ${player.playerNumber}`

        const playerPoints = document.createElement('p')
        playerPoints.innerText = `${player.points}`
        
        playerTile.append(playerNumber,playerPoints)  
        playersSection.append(playerTile)  
    }
}

const checkStatus = () => {
    const endOfTheGame = virtualBoard.every((tile) => {
        return tile.visibility === true
    })

    if(endOfTheGame){
        let bestPlayersPoints = 0
        
        players.forEach(player => {
            if(player.points >= bestPlayersPoints){
                bestPlayersPoints = player.points
                winners.push(player.playerNumber)
            }
        })

        if(winners.length > 1){
            winners.forEach((player,index) => {
                index < winners.length - 1 ? winner.innerHTML += `Player ${player} & ` : winner.innerHTML += `Player ${player}.` 
            })
            winner.innerHTML += `</br>You have a draw!!!`
        }else{
            winner.innerHTML = `Player ${winners[0]}`
        }
        toggleHandleView(scoreSection,true)
    }
}

const createTileNumbers = (gridSize) => {
    const array = []
    for(i = 0; i < 2; i++){
        for(j = 1; j <= (Math.pow(gridSize,2)/2); j++){
            array.push(j)
        }
    }
    return array
}

const createTiles = (gridSize) => {
    checkScreenWidth(gridSize)

    const numbers = createTileNumbers(gridSize)
    
    for(i = 0; i < Math.pow(gridSize, 2); i++){
        let randomNumber = Math.floor(Math.random() * numbers.length)

        const virtualTile = {
            "index": i,
            "number": numbers[randomNumber],
            "visibility": false
        }

        const tile = document.createElement('span')
        tile.classList.add('tile')

        gameBoard.appendChild(tile)
        virtualBoard.push(virtualTile)
        numbers.splice(randomNumber,1)
    }
}

const toggleHandleView = (view, value) => {
    value ? view.style.display = 'flex' : view.style.display = 'none'
}

const startGame = () => {
    resetGameBoard()

    numberOfPlayers = document.querySelector("input[name='number-of-players']:checked").value
    gridSize = document.querySelector("input[name='grid-size']:checked").value

    toggleHandleView(menuSection, false)
    createTiles(gridSize)
    createPlayers(numberOfPlayers)
    game()
}

const checkScreenWidth = (gridSize) => {
    if(screen.width > 445){
        gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 70px)`
        gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 70px)`
        gameBoard.style.width = `${((gridSize*70) + ((gridSize-1)*5))}px`
    }else{
        let tileWidth = `${((screen.width - 20) - (gridSize-1)*5) / gridSize}`

        gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, ${tileWidth}px)`
        gameBoard.style.gridTemplateRows = `repeat(${gridSize}, ${tileWidth}px)`
        gameBoard.style.width = `100vw`
    }
}

const resetGameBoard = () => {
    gameBoard.innerHTML = null
    playersSection.innerHTML = null
    players.length = 0
    virtualBoard.length = 0
    winners.length = 0
    winner.innerHTML = ''
}

startGameBtn.addEventListener('click', (e) => {
    e.preventDefault()
    startGame()
})

newGameBtns.forEach(newGameBtn => {
    newGameBtn.addEventListener('click', () => {
        toggleHandleView(scoreSection,false)
        toggleHandleView(menuSection,true)
    })
})

restartGameBtns.forEach(restartGameBtn => {
    restartGameBtn.addEventListener('click', () => {
        toggleHandleView(scoreSection,false)
        startGame(numberOfPlayers,gridSize)
    })
})

window.addEventListener('resize', () => gameBoard.innerHTML !== '' ? checkScreenWidth(gridSize) : null)