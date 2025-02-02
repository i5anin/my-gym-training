<template>
  <v-app>
    <AppHeader />
    <v-main class="d-flex flex-column">
      <AppContent class="flex-1-1" />
      <AppFooter class="flex-0-0" />
    </v-main>
  </v-app>
</template>

<script>
import { AppHeader, AppContent, AppFooter } from '@/components'
// import Modal from '@/components/shared/Modal.vue'
// import { Routes } from '@/router'

export default {
  components: { AppHeader, AppContent, AppFooter },
  created() {
    this.checkAuth()
  },
  methods: {
    checkAuth() {
      // const authUser = localStorage.getItem('user')
      // if (authUser == null) {
      //    this.$router.push(Routes.LOGIN)
      // }
    },
  },
}
</script>

<style>
body {
  font-family: 'Nunito', sans-serif;
}
</style>
