<template>
  <div>
    <!-- Сообщение, если нет тренировок -->
    <v-alert v-if="!workouts || workouts.length === 0" type="info">
      Нет доступных тренировок
    </v-alert>

    <!-- Основная таблица -->
    <v-data-table
      v-if="cleanWorkouts.length"
      :headers="headers"
      :items="cleanWorkouts"
      item-key="workout_id"
      dense
      fixed-header
      class="elevation-2"
    />
  </div>
</template>

<script setup>
import { computed, defineProps, watchEffect, onMounted } from 'vue'

const props = defineProps({
  workouts: {
    type: Array,
    required: true,
  },
})

// ✅ Преобразуем `sets` в строку для отображения внутри таблицы
const cleanWorkouts = computed(() =>
  (props.workouts || []).map((obj) => ({
    ...obj,
    sets: obj.sets ? formatSetsText(obj.sets) : '—',
  }))
)

// ✅ Логируем данные при обновлении
watchEffect(() => {
  console.log('WorkoutTable.vue обновленные данные:', cleanWorkouts.value)
})

// ✅ Логируем данные при монтировании
onMounted(() => {
  console.log('WorkoutTable.vue загруженные данные (при монтировании):', cleanWorkouts.value)
})

const headers = [
  { text: 'ID', value: 'workout_id' },
  { text: 'Номер', value: 'workout_number' },
  { text: 'Название', value: 'title' },
  { text: 'Группа мышц', value: 'muscle_group' },
  { text: 'Тип упражнения', value: 'exercise_type' },
  { text: 'Подходы', value: 'sets' },
]

// ✅ Форматируем `sets` в текст для отображения в таблице
const formatSetsText = (sets) => {
  if (!sets || typeof sets !== 'object') return '—'
  return Object.keys(sets)
    .map((key) => `${key.replace('set_', '')}: ${sets[key].weight} кг × ${sets[key].repetitions} повторений`)
    .join('; ')
}
</script>

<style scoped>
/* Добавляем немного стилей для читаемости подходов */
</style>
