<template>
  <v-row>
    <v-col cols="6" md="3">
      <v-text-field
        v-model="localDropSet.value"
        label="Добивка: Вес × Повторения"
        @input="updateDropSet(localDropSet.value)"
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

// Функция для обновления веса и количества повторений в одном инпуте
function updateDropSet(value) {
  const parts = value.split(' ').map((p) => p.trim()).filter(Boolean)
  localDropSet.value.weight = parts[0] || ''
  localDropSet.value.repetitions = parts[1] || ''
  localDropSet.value.value = `${localDropSet.value.weight} ${localDropSet.value.repetitions}`.trim()
}
</script>
