<template>
  <div class="game-container min-h-screen p-4">
    <div class="game-header">
      <div class="game-info">
        <h1 class="game-title text-glow">Tic-Tac-Toe</h1>
        <div class="game-meta">
          <span class="board-info">{{ boardSize }}×{{ boardSize }}</span>
          <span class="win-info">{{ winCondition }} in a row</span>
        </div>
      </div>
      
      <div class="current-player" v-if="gameStatus === 'playing'">
        <div class="player-indicator">
          <div 
            class="player-symbol pulse"
            :style="{ color: currentPlayerData.color }"
          >
            {{ currentPlayerData.symbol }}
          </div>
          <div class="player-name">{{ currentPlayerData.name }}'s Turn</div>
        </div>
      </div>
      
      <div class="game-status" v-else-if="gameStatus === 'finished'">
        <div class="status-message">
          <div v-if="winner !== null" class="winner-announcement">
            <div 
              class="winner-symbol bounce"
              :style="{ color: players[winner].color }"
            >
              {{ players[winner].symbol }}
            </div>
            <div class="winner-text">{{ players[winner].name }} Wins!</div>
          </div>
          <div v-else class="draw-message">
            <div class="draw-text">It's a Draw!</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="game-board-container">
      <div 
        class="game-board"
        :style="{ 
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          '--board-size': boardSize 
        }"
      >
        <template v-for="(row, rowIndex) in board" :key="rowIndex">
          <div
            v-for="(cell, colIndex) in row"
            :key="`${rowIndex}-${colIndex}`"
            :class="[
              'cell',
              { 
                'winning-cell': isWinningCell(rowIndex, colIndex),
                'last-move': isLastMove(rowIndex, colIndex),
                'occupied': cell !== null,
                'available': cell === null && gameStatus === 'playing'
              }
            ]"
            @click="makeMove(rowIndex, colIndex)"
          >
            <!-- Cell coordinate display -->
            <div class="cell-coordinate">
              {{ String.fromCharCode(65 + rowIndex) }}{{ colIndex + 1 }}
            </div>
            
            <div 
              v-if="cell !== null"
              class="cell-content"
              :style="{ color: players[cell].color }"
            >
              <span class="cell-symbol">{{ players[cell].symbol }}</span>
              <div class="cell-glow" :style="{ background: players[cell].color }"></div>
            </div>
            
            <div v-else class="cell-hover-indicator"></div>
          </div>
        </template>
      </div>
    </div>
    
    <div class="game-controls">
      <div class="players-status">
        <div 
          v-for="player in activePlayers"
          :key="player.id"
          :class="[
            'player-status',
            { 
              'active': currentPlayer === player.id && gameStatus === 'playing',
              'winner': winner === player.id
            }
          ]"
        >
          <div 
            class="status-symbol"
            :style="{ color: player.color }"
          >
            {{ player.symbol }}
          </div>
          <div class="status-name">{{ player.name }}</div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button 
          class="btn btn-undo" 
          @click="undoMove" 
          @mouseenter="handleHover"
          :class="{ disabled: !canUndo }"
        >
          <span class="btn-icon">↶</span>
          Undo
        </button>
        
        <button class="btn btn-primary" @click="restartGame" @mouseenter="handleHover">
          <span class="btn-icon">🔄</span>
          New Game
        </button>
        
        <button class="btn btn-secondary" @click="backToMenu" @mouseenter="handleHover">
          <span class="btn-icon">🏠</span>
          Main Menu
        </button>
      </div>
    </div>
    
    <!-- Floating Elements -->
    <div class="floating-elements">
      <div 
        v-for="n in 5" 
        :key="n"
        class="floating-shape"
        :style="{ 
          animationDelay: (n * 2) + 's',
          left: (n * 20) + '%'
        }"
      ></div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useRouter } from 'vue-router'
import { soundManager } from '../utils/soundManager'

export default {
  name: 'GameBoard',
  setup() {
    const gameStore = useGameStore()
    const router = useRouter()
    
    // Computed properties from store
    const board = computed(() => gameStore.board)
    const boardSize = computed(() => gameStore.boardSize)
    const winCondition = computed(() => gameStore.winCondition)
    const currentPlayer = computed(() => gameStore.currentPlayer)
    const currentPlayerData = computed(() => gameStore.currentPlayerData)
    const gameStatus = computed(() => gameStore.gameStatus)
    const winner = computed(() => gameStore.winner)
    const winningCells = computed(() => gameStore.winningCells)
    const lastMove = computed(() => gameStore.lastMove)
    const players = computed(() => gameStore.players)
    const activePlayers = computed(() => gameStore.activePlayers)
    const canUndo = computed(() => gameStore.canUndo)
    
    // Redirect to menu if no game is active
    if (gameStore.gameStatus === 'menu') {
      router.push('/')
    }
    
    const makeMove = (row, col) => {
      gameStore.makeMove(row, col)
    }
    
    const isWinningCell = (row, col) => {
      return winningCells.value.some(([winRow, winCol]) => winRow === row && winCol === col)
    }
    
    const isLastMove = (row, col) => {
      return lastMove.value && lastMove.value.row === row && lastMove.value.col === col
    }
    
    const restartGame = () => {
      soundManager.playSound('click')
      gameStore.initializeBoard()
    }
    
    const backToMenu = () => {
      soundManager.playSound('click')
      gameStore.resetGame()
      router.push('/')
    }
    
    const handleHover = () => {
      soundManager.playSound('hover')
    }
    
    const undoMove = () => {
      const result = gameStore.undoMove()
      if (result) {
        soundManager.playSound('undo')
      }
    }
    
    return {
      board,
      boardSize,
      winCondition,
      currentPlayer,
      currentPlayerData,
      gameStatus,
      winner,
      winningCells,
      lastMove,
      players,
      activePlayers,
      canUndo,
      makeMove,
      isWinningCell,
      isLastMove,
      restartGame,
      backToMenu,
      handleHover,
      undoMove
    }
  }
}
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.game-header {
  text-align: center;
  width: 100%;
}

.game-title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.game-meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  font-size: 0.9rem;
  color: var(--secondary-color);
  margin-bottom: 1rem;
}

.current-player {
  margin-top: 1rem;
}

.player-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.player-symbol {
  font-size: 3rem;
  font-weight: bold;
}

.player-name {
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.game-status {
  margin-top: 1rem;
}

.winner-announcement {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.winner-symbol {
  font-size: 4rem;
  font-weight: bold;
}

.winner-text {
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--success-color);
}

.draw-text {
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--warning-color);
}

.game-board-container {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 1rem;
}

.game-board {
  display: grid;
  gap: 4px;
  background: rgba(0, 245, 255, 0.1);
  padding: 8px;
  border-radius: 12px;
  border: 2px solid var(--primary-color);
  box-shadow: var(--shadow-neon);
  max-width: min(80vw, 80vh);
  width: 100%;
  aspect-ratio: 1;
}

.cell {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 245, 255, 0.2);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
  min-height: 40px;
}

.cell-coordinate {
  position: absolute;
  top: 2px;
  left: 2px;
  font-size: calc(min(80vw, 80vh) / var(--board-size) * 0.15);
  font-weight: 900;
  font-family: 'Arial', 'Helvetica', sans-serif;
  color: rgba(0, 245, 255, 0.8);
  text-shadow: 0 0 8px rgba(0, 245, 255, 0.5);
  z-index: 1;
  background: rgba(0, 0, 0, 0.5);
  padding: 1px 3px;
  border-radius: 3px;
  user-select: none;
  transition: opacity 0.3s ease;
  letter-spacing: 0.3px;
}

.cell.occupied .cell-coordinate {
  opacity: 0.3;
}

.cell:hover .cell-coordinate {
  opacity: 0.8;
}

.cell.available:hover {
  background: rgba(0, 245, 255, 0.1);
  border-color: var(--primary-color);
  box-shadow: inset 0 0 20px rgba(0, 245, 255, 0.2);
}

.cell.occupied {
  cursor: default;
}

.cell.winning-cell {
  background: rgba(0, 255, 128, 0.2);
  border-color: var(--success-color);
  box-shadow: 0 0 30px rgba(0, 255, 128, 0.5);
  animation: winning-pulse 1s ease-in-out infinite alternate;
}

.cell.last-move {
  background: rgba(255, 255, 0, 0.1);
  border-color: var(--warning-color);
}

.cell-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cell-symbol {
  font-size: calc(min(80vw, 80vh) / var(--board-size) * 0.5);
  font-weight: bold;
  z-index: 2;
  position: relative;
  animation: symbol-appear 0.3s ease-out;
}

.cell-glow {
  position: absolute;
  width: 60%;
  height: 60%;
  border-radius: 50%;
  opacity: 0.3;
  filter: blur(10px);
  animation: glow-pulse 2s ease-in-out infinite alternate;
}

.cell-hover-indicator {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(0, 245, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cell.available:hover .cell-hover-indicator {
  opacity: 1;
}

.game-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}

.players-status {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  flex-wrap: nowrap;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  padding: 0.5rem;
  margin: 0 auto;
}

.player-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 0.6rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
  min-width: 90px;
  max-width: 120px;
  flex: 0 1 auto;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
}

.player-status.active {
  border-color: var(--primary-color);
  background: rgba(0, 245, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 245, 255, 0.3);
}

.player-status.winner {
  border-color: var(--success-color);
  background: rgba(0, 255, 128, 0.1);
  box-shadow: 0 0 20px rgba(0, 255, 128, 0.3);
}

.status-symbol {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
}

.status-name {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  max-width: 100%;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-undo {
  background: linear-gradient(45deg, #ff6b00, #ffa500);
  color: #000;
  border: none;
  font-size: 0.9rem;
  padding: 12px 20px;
  box-shadow: 0 0 20px rgba(255, 107, 0, 0.3);
  transition: all 0.3s ease;
}

.btn-undo:hover:not(.disabled) {
  background: linear-gradient(45deg, #ffa500, #ff6b00);
  box-shadow: 0 0 30px rgba(255, 107, 0, 0.5);
  transform: translateY(-2px);
}

.btn-undo.disabled {
  background: rgba(255, 107, 0, 0.3);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  box-shadow: 0 0 10px rgba(255, 107, 0, 0.2);
}

.btn-undo.disabled:hover {
  background: rgba(255, 107, 0, 0.4);
  box-shadow: 0 0 15px rgba(255, 107, 0, 0.3);
  transform: translateY(-1px);
}

.floating-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.floating-shape {
  position: absolute;
  width: 20px;
  height: 20px;
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  border-radius: 50%;
  animation: float-bounce 6s ease-in-out infinite;
  opacity: 0.3;
}

/* Animations */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
}

@keyframes symbol-appear {
  0% { transform: scale(0) rotate(-180deg); opacity: 0; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

@keyframes winning-pulse {
  0% { box-shadow: 0 0 30px rgba(0, 255, 128, 0.5); }
  100% { box-shadow: 0 0 50px rgba(0, 255, 128, 0.8); }
}

@keyframes glow-pulse {
  0% { opacity: 0.3; transform: scale(1); }
  100% { opacity: 0.6; transform: scale(1.1); }
}

@keyframes float-bounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(90deg); }
  50% { transform: translateY(0) rotate(180deg); }
  75% { transform: translateY(-10px) rotate(270deg); }
}

.pulse { animation: pulse 2s ease-in-out infinite; }
.bounce { animation: bounce 2s ease-in-out infinite; }

/* Responsive design */
@media (min-width: 1200px) {
  .players-status {
    gap: 1.2rem;
    max-width: 1200px;
    flex-wrap: nowrap;
  }
  
  .player-status {
    min-width: 120px;
    max-width: 140px;
    padding: 1rem 0.8rem;
    flex: 1;
  }
  
  .status-symbol {
    font-size: 1.6rem;
  }
  
  .status-name {
    font-size: 0.85rem;
  }
}

@media (max-width: 1199px) and (min-width: 992px) {
  .players-status {
    gap: 1rem;
    max-width: 1000px;
    flex-wrap: nowrap;
  }
  
  .player-status {
    min-width: 100px;
    max-width: 120px;
    padding: 0.9rem 0.7rem;
    flex: 1;
  }
  
  .status-symbol {
    font-size: 1.5rem;
  }
  
  .status-name {
    font-size: 0.8rem;
    letter-spacing: 0.8px;
  }
}

@media (max-width: 991px) and (min-width: 769px) {
  .players-status {
    gap: 0.8rem;
    max-width: 900px;
    flex-wrap: nowrap;
  }
  
  .player-status {
    min-width: 85px;
    max-width: 105px;
    padding: 0.8rem 0.6rem;
    flex: 1;
  }
  
  .status-symbol {
    font-size: 1.4rem;
  }
  
  .status-name {
    font-size: 0.75rem;
    letter-spacing: 0.6px;
  }
}

@media (max-width: 768px) {
  .game-container {
    gap: 1rem;
    padding: 1rem;
  }
  
  .game-title {
    font-size: 2rem;
  }
  
  .game-meta {
    gap: 1rem;
    font-size: 0.8rem;
  }
  
  .player-symbol {
    font-size: 2rem;
  }
  
  .player-name {
    font-size: 1rem;
  }
  
  .winner-symbol {
    font-size: 3rem;
  }
  
  .winner-text {
    font-size: 1.2rem;
  }
  
  .game-board {
    gap: 2px;
    padding: 4px;
    max-width: 90vw;
  }
  
  .cell {
    min-height: 30px;
  }
  
  .cell-coordinate {
    font-size: clamp(4px, calc(90vw / var(--board-size) * 0.08), 10px);
    top: 1px;
    left: 1px;
    padding: 0px 1px;
    letter-spacing: 0.1px;
  }
  
  .cell-symbol {
    font-size: calc(90vw / var(--board-size) * 0.4);
  }
  
  .players-status {
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
    padding: 0.5rem;
    overflow-x: visible;
  }
  
  .player-status {
    padding: 0.5rem 0.75rem;
    min-width: 70px;
    max-width: 90px;
    flex: 0 0 auto;
  }
  
  .status-symbol {
    font-size: 1.1rem;
  }
  
  .status-name {
    font-size: 0.65rem;
    letter-spacing: 0.5px;
    line-height: 1.1;
  }
  
  .action-buttons {
    gap: 0.5rem;
  }
  
  .btn {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .game-title {
    font-size: 1.5rem;
  }
  
  .players-status {
    gap: 0.3rem;
    padding: 0.3rem;
  }
  
  .player-status {
    padding: 0.4rem 0.5rem;
    min-width: 60px;
    max-width: 75px;
    gap: 0.3rem;
  }
  
  .status-symbol {
    font-size: 1rem;
  }
  
  .status-name {
    font-size: 0.55rem;
    letter-spacing: 0.3px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }
  
  .btn {
    width: 100%;
    padding: 10px 16px;
  }
}

@media (max-width: 360px) {
  .players-status {
    gap: 0.2rem;
    padding: 0.2rem;
  }
  
  .player-status {
    padding: 0.3rem 0.4rem;
    min-width: 50px;
    max-width: 65px;
    border-radius: 6px;
  }
  
  .status-symbol {
    font-size: 0.9rem;
  }
  
  .status-name {
    font-size: 0.5rem;
    letter-spacing: 0.2px;
  }
  
  .game-controls {
    gap: 1rem;
  }
}
</style>