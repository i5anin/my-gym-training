<template>
  <v-row>
    <v-col cols="6" md="2">
      <v-text-field
        v-model="localDropSet.weight"
        label="Добивка: Вес (кг)"
        type="number"
      />
    </v-col>
    <v-col cols="6" md="2">
      <v-text-field
        v-model="localDropSet.repetitions"
        label="Добивка: Повторения"
        type="number"
      />
    </v-col>
    <v-col cols="6" md="2">
      <v-btn @click="$emit('remove')" color="error">Удалить</v-btn>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

// Определяем пропсы
const props = defineProps({
  dropSet: Object,
})

// Определяем события
const emit = defineEmits(['update:dropSet', 'remove'])

// Создаём реактивную копию объекта dropSet
const localDropSet = ref({ ...props.dropSet })

// Следим за изменениями localDropSet и отправляем их родителю
watch(
  localDropSet,
  (newValue) => {
    emit('update:dropSet', newValue)
  },
  { deep: true }
)
</script>
