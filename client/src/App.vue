<template>
  <v-app>
    <AppHeader />
    <AppContent class="flex-1-1 content-padding" />
    <AppFooter class="flex-0-0" />
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
.content-padding {
  padding-left: 75px; /* Отступ слева */
}
</style>
