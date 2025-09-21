<template>
  <div class="min-h-screen flex-center flex-col p-4">
    <div class="main-menu">
      <h1 class="title text-glow">Tic-Tac-Toe</h1>
      <h2 class="subtitle text-center mb-6">Customize Edition</h2>
      
      <div class="menu-container">
        <div class="settings-panel card">
          <h3 class="text-xl mb-4 text-center text-glow">Game Settings</h3>
          
          <!-- Player Count -->
          <div class="setting-group">
            <label class="setting-label">Number of Players</label>
            <div class="option-grid">
              <button 
                v-for="count in [2, 3, 4]" 
                :key="count"
                :class="['option-btn', { active: playerCount === count }]"
                @click="playerCount = count"
              >
                {{ count }} Players
              </button>
            </div>
          </div>
          
          <!-- Board Size -->
          <div class="setting-group">
            <label class="setting-label">Board Size</label>
            <div class="option-grid">
              <button 
                v-for="size in boardSizes" 
                :key="size"
                :class="['option-btn', { active: boardSize === size }]"
                @click="selectBoardSize(size)"
              >
                {{ size }}×{{ size }}
              </button>
            </div>
          </div>
          
          <!-- Win Condition -->
          <div class="setting-group">
            <label class="setting-label">Win Condition ({{ winCondition }} in a row)</label>
            <div class="slider-container">
              <input 
                type="range" 
                :min="minWinCondition" 
                :max="maxWinCondition" 
                v-model="winCondition"
                class="slider"
              >
              <div class="slider-labels">
                <span>{{ minWinCondition }}</span>
                <span>{{ maxWinCondition }}</span>
              </div>
            </div>
          </div>
          
          <!-- Player Preview -->
          <div class="players-preview">
            <h4 class="text-lg mb-3 text-center">Players</h4>
            <div class="players-grid">
              <div 
                v-for="player in activePlayers" 
                :key="player.id"
                class="player-card"
                :style="{ borderColor: player.color }"
              >
                <div 
                  class="player-symbol"
                  :style="{ color: player.color }"
                >
                  {{ player.symbol }}
                </div>
                <div class="player-name">{{ player.name }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="actions">
          <button class="btn btn-primary btn-large" @click="startGame">
            <span class="btn-icon">🚀</span>
            Start Game
          </button>
          
          <button class="btn btn-secondary" @click="showSettings = !showSettings">
            <span class="btn-icon">⚙️</span>
            {{ showSettings ? 'Hide' : 'Show' }} Advanced Settings
          </button>
        </div>
        
        <!-- Advanced Settings Modal -->
        <div v-if="showSettings" class="settings-modal">
          <div class="modal-content card">
            <h3 class="text-xl mb-4 text-center">Advanced Settings</h3>
            
            <div class="setting-group">
              <label class="setting-label">Custom Board Size</label>
              <input 
                type="number" 
                v-model.number="customBoardSize"
                :min="3" 
                :max="10"
                class="input-field"
                placeholder="Enter size (3-10)"
              >
              <button class="btn btn-small" @click="applyCustomSize">Apply</button>
            </div>
            
            <div class="actions">
              <button class="btn" @click="showSettings = false">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useRouter } from 'vue-router'

export default {
  name: 'MainMenu',
  setup() {
    const gameStore = useGameStore()
    const router = useRouter()
    
    const showSettings = ref(false)
    const customBoardSize = ref(5)
    
    const playerCount = ref(2)
    const boardSize = ref(3)
    const winCondition = ref(3)
    
    const boardSizes = [3, 4, 5, 6, 7, 8, 9, 10]
    
    const minWinCondition = computed(() => 3)
    const maxWinCondition = computed(() => Math.min(6, boardSize.value))
    
    const activePlayers = computed(() => gameStore.players.slice(0, playerCount.value))
    
    const selectBoardSize = (size) => {
      boardSize.value = size
      if (winCondition.value > size) {
        winCondition.value = Math.min(size, 6)
      }
    }
    
    const applyCustomSize = () => {
      if (customBoardSize.value >= 3 && customBoardSize.value <= 10) {
        selectBoardSize(customBoardSize.value)
        showSettings.value = false
      }
    }
    
    const startGame = () => {
      gameStore.updateSettings({
        boardSize: boardSize.value,
        winCondition: winCondition.value,
        playerCount: playerCount.value
      })
      
      gameStore.initializeBoard()
      router.push('/game')
    }
    
    return {
      showSettings,
      customBoardSize,
      playerCount,
      boardSize,
      winCondition,
      boardSizes,
      minWinCondition,
      maxWinCondition,
      activePlayers,
      selectBoardSize,
      applyCustomSize,
      startGame
    }
  }
}
</script>

<style scoped>
.main-menu {
  max-width: 800px;
  width: 100%;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--secondary-color);
  margin-top: -1rem;
}

.menu-container {
  position: relative;
}

.settings-panel {
  margin-bottom: 2rem;
}

.setting-group {
  margin-bottom: 1.5rem;
}

.setting-label {
  display: block;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
}

.option-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 245, 255, 0.3);
  color: var(--text-light);
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Orbitron', monospace;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.option-btn:hover {
  border-color: var(--primary-color);
  background: rgba(0, 245, 255, 0.1);
}

.option-btn.active {
  background: var(--primary-color);
  color: #000;
  border-color: var(--primary-color);
  box-shadow: 0 0 20px rgba(0, 245, 255, 0.5);
}

.slider-container {
  position: relative;
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  box-shadow: 0 0 10px var(--primary-color);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  border: none;
  box-shadow: 0 0 10px var(--primary-color);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.players-preview {
  margin-top: 1.5rem;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
}

.player-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;
}

.player-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}

.player-symbol {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.player-name {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.btn-primary {
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  color: #000;
  border: none;
  font-size: 1.1rem;
  padding: 16px 32px;
  box-shadow: 0 0 30px rgba(0, 245, 255, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(45deg, var(--secondary-color), var(--primary-color));
  box-shadow: 0 0 50px rgba(0, 245, 255, 0.5);
}

.btn-secondary {
  background: transparent;
  border: 1px solid var(--secondary-color);
  color: var(--secondary-color);
}

.btn-secondary:hover {
  background: var(--secondary-color);
  color: #000;
}

.btn-large {
  font-size: 1.2rem;
  padding: 18px 36px;
}

.btn-small {
  padding: 6px 12px;
  font-size: 0.8rem;
}

.btn-icon {
  margin-right: 8px;
}

.settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.input-field {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 245, 255, 0.3);
  color: var(--text-light);
  padding: 8px 12px;
  border-radius: 6px;
  font-family: 'Orbitron', monospace;
  margin-bottom: 0.5rem;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 10px rgba(0, 245, 255, 0.3);
}

@media (max-width: 768px) {
  .main-menu {
    padding: 1rem;
  }
  
  .option-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }
  
  .players-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }
  
  .actions {
    gap: 0.5rem;
  }
  
  .btn {
    width: 100%;
  }
}
</style>