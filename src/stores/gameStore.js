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
    
    // Move history for undo functionality
    moveHistory: [],
    
    // Player configuration
    players: [
      { id: 0, symbol: '✖', name: 'Player 1', color: '#00f5ff' },
      { id: 1, symbol: '⭕', name: 'Player 2', color: '#ff0080' },
      { id: 2, symbol: '▲', name: 'Player 3', color: '#00ff80' },
      { id: 3, symbol: '◆', name: 'Player 4', color: '#ffff00' },
      { id: 4, symbol: '★', name: 'Player 5', color: '#ff8000' },
      { id: 5, symbol: '●', name: 'Player 6', color: '#8000ff' },
      { id: 6, symbol: '■', name: 'Player 7', color: '#ff0040' },
      { id: 7, symbol: '♦', name: 'Player 8', color: '#40ff00' },
      { id: 8, symbol: '♠', name: 'Player 9', color: '#0080ff' },
      { id: 9, symbol: '♥', name: 'Player 10', color: '#ff4080' }
    ],
    
    // Animation state
    lastMove: null,
    isAnimating: false
  }),
  
  getters: {
    activePlayers: (state) => state.players.slice(0, state.playerCount),
    currentPlayerData: (state) => state.players[state.currentPlayer],
    isBoardFull: (state) => state.board.every(row => row.every(cell => cell !== null)),
    gameFinished: (state) => state.gameStatus === 'finished',
    canUndo: (state) => state.gameStatus === 'playing' || state.gameStatus === 'finished'
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
      this.moveHistory = []
    },
    
    makeMove(row, col) {
      if (this.board[row][col] !== null || this.gameStatus !== 'playing' || this.isAnimating) {
        return false
      }
      
      this.isAnimating = true
      
      // Save move to history before making the move
      const moveData = { 
        row, 
        col, 
        player: this.currentPlayer,
        gameStatus: this.gameStatus
      }
      this.moveHistory.push(moveData)
      
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
    
    undoMove() {
      // If there's move history, undo the last move
      if (this.moveHistory.length > 0) {
        const lastMove = this.moveHistory.pop()
        
        // Clear the cell that was just played
        this.board[lastMove.row][lastMove.col] = null
        
        // Go back to the previous player (the one who made the last move)
        this.currentPlayer = lastMove.player
        
        // Reset game status to playing
        this.gameStatus = 'playing'
        this.winner = null
        this.winningCells = []
        
        // Update lastMove to the previous move (if any)
        this.lastMove = this.moveHistory.length > 0 
          ? this.moveHistory[this.moveHistory.length - 1] 
          : null
      } else {
        // If no move history, just go back to previous player
        this.currentPlayer = (this.currentPlayer - 1 + this.playerCount) % this.playerCount
        
        // Reset game status to playing if finished
        if (this.gameStatus === 'finished') {
          this.gameStatus = 'playing'
          this.winner = null
          this.winningCells = []
        }
      }
      
      return true
    },
    
    resetGame() {
      this.gameStatus = 'menu'
      this.board = []
      this.currentPlayer = 0
      this.winner = null
      this.winningCells = []
      this.lastMove = null
      this.moveHistory = []
    },
    
    updateSettings(settings) {
      this.boardSize = settings.boardSize
      this.winCondition = settings.winCondition
      this.playerCount = settings.playerCount
    }
  }
})