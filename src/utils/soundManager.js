export class SoundManager {
  constructor() {
    this.audioContext = null
    this.isInitialized = false
    this.sounds = {}
  }

  async init() {
    if (this.isInitialized) return
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      this.isInitialized = true
      this.createSounds()
    } catch (error) {
      console.log('Audio not supported:', error)
    }
  }

  createSounds() {
    // Player 1 sound - High frequency beep
    this.sounds.player0 = this.createBeep(800, 0.1, 'sine')
    
    // Player 2 sound - Medium frequency beep
    this.sounds.player1 = this.createBeep(600, 0.1, 'square')
    
    // Player 3 sound - Low frequency beep
    this.sounds.player2 = this.createBeep(400, 0.1, 'triangle')
    
    // Player 4 sound - Very low frequency beep
    this.sounds.player3 = this.createBeep(300, 0.1, 'sawtooth')
    
    // UI sounds
    this.sounds.click = this.createBeep(1000, 0.05, 'sine')
    this.sounds.hover = this.createBeep(1200, 0.03, 'sine')
    this.sounds.win = this.createWinSound()
    this.sounds.draw = this.createDrawSound()
  }

  createBeep(frequency, duration, type = 'sine') {
    return () => {
      if (!this.audioContext) return
      
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
      oscillator.type = type
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration)
      
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + duration)
    }
  }

  createWinSound() {
    return () => {
      if (!this.audioContext) return
      
      const frequencies = [523, 659, 784, 1047] // C, E, G, C
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          this.createBeep(freq, 0.3, 'sine')()
        }, index * 100)
      })
    }
  }

  createDrawSound() {
    return () => {
      if (!this.audioContext) return
      
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime)
      oscillator.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + 0.5)
      oscillator.type = 'sawtooth'
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5)
      
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.5)
    }
  }

  async playSound(soundName) {
    if (!this.isInitialized) {
      await this.init()
    }
    
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
    
    if (this.sounds[soundName]) {
      this.sounds[soundName]()
    }
  }

  playPlayerSound(playerId) {
    this.playSound(`player${playerId}`)
  }
}

export const soundManager = new SoundManager()