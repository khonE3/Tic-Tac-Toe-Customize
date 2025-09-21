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
    // Player sounds - Different frequencies and wave types for each player
    this.sounds.player0 = this.createBeep(800, 0.1, 'sine')
    this.sounds.player1 = this.createBeep(600, 0.1, 'square')
    this.sounds.player2 = this.createBeep(400, 0.1, 'triangle')
    this.sounds.player3 = this.createBeep(300, 0.1, 'sawtooth')
    this.sounds.player4 = this.createBeep(900, 0.1, 'sine')
    this.sounds.player5 = this.createBeep(500, 0.1, 'square')
    this.sounds.player6 = this.createBeep(350, 0.1, 'triangle')
    this.sounds.player7 = this.createBeep(750, 0.1, 'sawtooth')
    this.sounds.player8 = this.createBeep(450, 0.1, 'sine')
    this.sounds.player9 = this.createBeep(650, 0.1, 'square')
    
    // UI sounds
    this.sounds.click = this.createBeep(1000, 0.05, 'sine')
    this.sounds.hover = this.createBeep(1200, 0.03, 'sine')
    this.sounds.undo = this.createUndoSound()
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

  createUndoSound() {
    return () => {
      if (!this.audioContext) return
      
      // Create a descending beep sound for undo
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      // Start high and go low (reverse effect)
      oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime)
      oscillator.frequency.linearRampToValueAtTime(300, this.audioContext.currentTime + 0.2)
      oscillator.type = 'triangle'
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2)
      
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.2)
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