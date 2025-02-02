<template>
  <v-app-bar app color="primary" dark>
    <!-- Левая кнопка -->
    <v-btn icon @click="$emit('toggle-drawer', $event)">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <!-- Название -->
    <v-toolbar-title> PF-FORUM APP </v-toolbar-title>
    <v-spacer />
    <!-- Поле поиска не работает -->
    <v-text-field
      class="red"
      v-model="search"
      label="Поиск"
      v-if="showSearch"
    />
    <!-- Кнопка для отображения поля поиска -->
    <v-btn icon @click="showSearch = !showSearch">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <!-- Три кнопки справа -->
    <v-btn icon>
      <v-icon>mdi-fullscreen</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>mdi-moon-last-quarter</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>mdi-exit-to-app</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue'
// import { ref, defineEmits } from 'vue'

// const drawer = ref(false)
// const emit = defineEmits(['update:drawer'])

// Добавьте эти строки для функции поиска
const search = ref('')
const showSearch = ref(false) // Переменная для управления видимостью поля поиска
</script>
