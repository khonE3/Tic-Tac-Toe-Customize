<template>
  <div class="particles">
    <div 
      v-for="particle in particles" 
      :key="particle.id"
      class="particle"
      :style="particle.style"
    ></div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'BackgroundParticles',
  setup() {
    const particles = ref([])
    let animationFrame = null
    
    const createParticle = (id) => {
      const colors = ['#00f5ff', '#0080ff', '#ff0080', '#00ff80', '#ffff00']
      const size = Math.random() * 4 + 2
      
      return {
        id,
        style: {
          left: Math.random() * 100 + '%',
          width: size + 'px',
          height: size + 'px',
          background: colors[Math.floor(Math.random() * colors.length)],
          animationDelay: Math.random() * 10 + 's',
          animationDuration: (Math.random() * 10 + 10) + 's'
        }
      }
    }
    
    const initParticles = () => {
      const particleCount = window.innerWidth > 768 ? 50 : 25
      particles.value = Array.from({ length: particleCount }, (_, i) => createParticle(i))
    }
    
    onMounted(() => {
      initParticles()
      
      window.addEventListener('resize', initParticles)
    })
    
    onUnmounted(() => {
      window.removeEventListener('resize', initParticles)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    })
    
    return {
      particles
    }
  }
}
</script>

<style scoped>
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.particle {
  position: absolute;
  border-radius: 50%;
  animation: float 10s infinite linear;
  box-shadow: 0 0 10px currentColor;
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}
</style>