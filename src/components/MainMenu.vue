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
            <div class="option-grid players-grid-large">
              <button 
                v-for="count in [2, 3, 4, 5, 6, 7, 8, 9, 10]" 
                :key="count"
                :class="['option-btn', { active: playerCount === count }]"
                @click="selectPlayerCount(count)"
                @mouseenter="handleHover"
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
                @click="selectBoardSizeWithSound(size)"
                @mouseenter="handleHover"
              >
                {{ size }}×{{ size }}
              </button>
            </div>
          </div>
          
          <!-- Win Condition -->
          <div class="setting-group">
            <label class="setting-label">Win Condition ({{ winCondition }} in a row)</label>
            <div class="option-grid">
              <button 
                v-for="condition in availableWinConditions" 
                :key="condition"
                :class="['option-btn', { active: winCondition === condition }]"
                @click="selectWinCondition(condition)"
                @mouseenter="handleHover"
              >
                {{ condition }} in a row
              </button>
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
          <button class="btn btn-primary btn-large" @click="startGame" @mouseenter="handleHover">
            <span class="btn-icon">🚀</span>
            Start Game
          </button>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <p class="footer-text">Created by</p>
        <div class="footer-links">
          <a href="https://github.com/khonE3" target="_blank" class="footer-link">
            <img src="https://logos-world.net/wp-content/uploads/2020/11/GitHub-Symbol.png" alt="GitHub" class="footer-icon-img">
            GitHub: khonE3
          </a>
          <a href="https://www.instagram.com/gotjitag/" target="_blank" class="footer-link">
            <img src="https://png.pngtree.com/png-clipart/20180626/ourmid/pngtree-instagram-icon-instagram-logo-png-image_3584852.png" alt="Instagram" class="footer-icon-img">
            Instagram: @gotjitag
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useRouter } from 'vue-router'
import { soundManager } from '../utils/soundManager'

export default {
  name: 'MainMenu',
  setup() {
    const gameStore = useGameStore()
    const router = useRouter()
    
    const playerCount = ref(2)
    const boardSize = ref(3)
    const winCondition = ref(3)
    
    const boardSizes = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    
    const minWinCondition = computed(() => 3)
    const maxWinCondition = computed(() => Math.min(6, boardSize.value))
    
    const availableWinConditions = computed(() => {
      const max = Math.min(6, boardSize.value)
      return Array.from({ length: max - 2 }, (_, i) => i + 3)
    })
    
    const activePlayers = computed(() => gameStore.players.slice(0, playerCount.value))
    
    const selectBoardSize = (size) => {
      boardSize.value = size
      if (winCondition.value > size) {
        winCondition.value = Math.min(size, 6)
      }
    }
    
    const startGame = () => {
      soundManager.playSound('click')
      gameStore.updateSettings({
        boardSize: boardSize.value,
        winCondition: winCondition.value,
        playerCount: playerCount.value
      })
      
      gameStore.initializeBoard()
      router.push('/game')
    }
    
    const handleButtonClick = (callback) => {
      soundManager.playSound('click')
      if (callback) callback()
    }
    
    const handleHover = () => {
      soundManager.playSound('hover')
    }
    
    const selectPlayerCount = (count) => {
      handleButtonClick(() => playerCount.value = count)
    }
    
    const selectBoardSizeWithSound = (size) => {
      handleButtonClick(() => selectBoardSize(size))
    }
    
    const selectWinCondition = (condition) => {
      handleButtonClick(() => winCondition.value = condition)
    }
    
    return {
      playerCount,
      boardSize,
      winCondition,
      boardSizes,
      minWinCondition,
      maxWinCondition,
      availableWinConditions,
      activePlayers,
      selectBoardSize,
      startGame,
      handleButtonClick,
      handleHover,
      selectPlayerCount,
      selectBoardSizeWithSound,
      selectWinCondition,
      soundManager
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

.players-grid-large {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 0.4rem;
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

.btn-large {
  font-size: 1.2rem;
  padding: 18px 36px;
}

.btn-icon {
  margin-right: 8px;
}

.footer {
  margin-top: 3rem;
  padding: 2rem 0 1rem;
  border-top: 1px solid rgba(0, 245, 255, 0.2);
}

.footer-content {
  text-align: center;
}

.footer-text {
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.footer-link:hover {
  background: rgba(0, 245, 255, 0.1);
  border-color: var(--primary-color);
  box-shadow: 0 0 15px rgba(0, 245, 255, 0.3);
  transform: translateY(-2px);
}

.footer-icon-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  filter: none;
  transition: all 0.3s ease;
}

.footer-link:hover .footer-icon-img {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .main-menu {
    padding: 1rem;
  }
  
  .option-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }
  
  .players-grid-large {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    gap: 0.3rem;
  }
  
  .players-grid {
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 0.3rem;
  }
  
  .option-btn {
    padding: 6px 8px;
    font-size: 0.7rem;
  }
  
  .actions {
    gap: 0.5rem;
  }
  
  .btn {
    width: 100%;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 1rem;
  }
  
  .footer-link {
    justify-content: center;
  }
}
</style>