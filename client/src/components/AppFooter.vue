<template>
  <v-footer v-if="databaseInfo" class="container">
    Все права защищены 2023
    <v-spacer />
    <span :class="{ 'text-red': isBuildDatabase }">
      Версия {{ databaseInfo.databaseType }}
    </span>
  </v-footer>
</template>

<script>
import { getDatabaseInfo } from '@/api/getDatabaseInfo'

export default {
  name: 'AppFooter',
  data() {
    return {
      databaseInfo: null,
    }
  },
  computed: {
    isBuildDatabase() {
      return this.databaseInfo && this.databaseInfo.databaseType === 'build'
    },
  },
  async mounted() {
    try {
      this.databaseInfo = await getDatabaseInfo()
    } catch (error) {
      console.error('Failed to load database info:', error)
    }
  },
}
</script>

<style scoped lang="css">
.text-red {
  color: red;
}
</style>
