import { defineStore } from 'pinia'
import { soundManager } from '../utils/soundManager'

export const useGameStore = defineStore('game', {
  state: () => ({
    // Game settings
    boardSize: 3,
    winCondition: 3,
    playerCount: 2,
    
    // Game state
    board: [],
    currentPlayer: 0,
    gameStatus: 'menu', // 'menu', 'playing', 'finished'
    winner: null,
    winningCells: [],
    
    // Player configuration
    players: [
      { id: 0, symbol: '✖', name: 'Player 1', color: '#00f5ff' },
      { id: 1, symbol: '⭕', name: 'Player 2', color: '#ff0080' },
      { id: 2, symbol: '▲', name: 'Player 3', color: '#00ff80' },
      { id: 3, symbol: '◆', name: 'Player 4', color: '#ffff00' }
    ],
    
    // Animation state
    lastMove: null,
    isAnimating: false
  }),
  
  getters: {
    activePlayers: (state) => state.players.slice(0, state.playerCount),
    currentPlayerData: (state) => state.players[state.currentPlayer],
    isBoardFull: (state) => state.board.every(row => row.every(cell => cell !== null)),
    gameFinished: (state) => state.gameStatus === 'finished'
  },
  
  actions: {
    initializeBoard() {
      this.board = Array(this.boardSize).fill(null).map(() => 
        Array(this.boardSize).fill(null)
      )
      this.currentPlayer = 0
      this.gameStatus = 'playing'
      this.winner = null
      this.winningCells = []
      this.lastMove = null
    },
    
    makeMove(row, col) {
      if (this.board[row][col] !== null || this.gameStatus !== 'playing' || this.isAnimating) {
        return false
      }
      
      this.isAnimating = true
      this.board[row][col] = this.currentPlayer
      this.lastMove = { row, col, player: this.currentPlayer }
      
      // Play sound for current player
      soundManager.playPlayerSound(this.currentPlayer)
      
      // Check for win
      const winResult = this.checkWin(row, col)
      if (winResult) {
        this.winner = this.currentPlayer
        this.winningCells = winResult
        this.gameStatus = 'finished'
        // Play win sound
        setTimeout(() => soundManager.playSound('win'), 300)
      } else if (this.isBoardFull) {
        this.gameStatus = 'finished'
        this.winner = null // Draw
        // Play draw sound
        setTimeout(() => soundManager.playSound('draw'), 300)
      } else {
        this.currentPlayer = (this.currentPlayer + 1) % this.playerCount
      }
      
      setTimeout(() => {
        this.isAnimating = false
      }, 300)
      
      return true
    },
    
    checkWin(row, col) {
      const directions = [
        [0, 1],   // horizontal
        [1, 0],   // vertical
        [1, 1],   // diagonal
        [1, -1]   // anti-diagonal
      ]
      
      for (const [dx, dy] of directions) {
        const cells = []
        
        // Check in both directions
        for (let i = -this.winCondition + 1; i < this.winCondition; i++) {
          const newRow = row + i * dx
          const newCol = col + i * dy
          
          if (
            newRow >= 0 && newRow < this.boardSize &&
            newCol >= 0 && newCol < this.boardSize &&
            this.board[newRow][newCol] === this.currentPlayer
          ) {
            cells.push([newRow, newCol])
          } else {
            if (cells.length >= this.winCondition) break
            cells.length = 0
          }
          
          if (cells.length >= this.winCondition) {
            return cells
          }
        }
      }
      
      return null
    },
    
    resetGame() {
      this.gameStatus = 'menu'
      this.board = []
      this.currentPlayer = 0
      this.winner = null
      this.winningCells = []
      this.lastMove = null
    },
    
    updateSettings(settings) {
      this.boardSize = settings.boardSize
      this.winCondition = settings.winCondition
      this.playerCount = settings.playerCount
    }
  }
})