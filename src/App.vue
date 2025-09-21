<template>
  <div id="app">
    <BackgroundParticles />
    <router-view />
  </div>
</template>

<script>
import BackgroundParticles from './components/BackgroundParticles.vue'

export default {
  name: 'App',
  components: {
    BackgroundParticles
  }
}
</script>