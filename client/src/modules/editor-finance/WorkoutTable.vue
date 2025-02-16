<template>
  <v-table v-if="workouts.length">
    <thead>
      <tr>
        <th v-for="header in headers" :key="header.key">
          {{ header.title }}
        </th>
        <th v-for="setIndex in maxSetCount" :key="'set-' + setIndex">
          {{ `Сет ${setIndex}` }}
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="workout in workouts"
        :key="workout.workout_id"
        :class="[getRowClass(workout.training_date)]"
      >
        <td
          :class="{
            'error-text': isIncorrectWorkoutNumber(workout.training_date),
          }"
        >
          {{ workout.workout_id }}
        </td>
        <td
          :class="{
            'error-text': isIncorrectWorkoutNumber(workout.training_date),
          }"
        >
          {{ workout.workout_number }}
        </td>
        <td>{{ formatDate(workout.training_date) }}</td>
        <td>{{ workout.muscle_group }}</td>
        <td :title="workout.exercise_symbol">
          {{ workout.exercise_name }}
        </td>

        <!-- Вывод сетов -->
        <td v-for="setIndex in maxSetCount" :key="'set-' + setIndex">
          <template v-if="workout.sets[setIndex - 1]">
            {{ workout.sets[setIndex - 1].weight
            }}<span :style="{ color: 'grey' }">×</span
            >{{ workout.sets[setIndex - 1].repetitions }}

            <!-- Вывод добивок -->
            <span
              v-if="
                Array.isArray(workout.sets[setIndex - 1].extra) &&
                workout.sets[setIndex - 1].extra.length
              "
              class="extra-sets"
            >
              <br />
              <span
                v-for="(extra, i) in workout.sets[setIndex - 1].extra"
                :key="i"
              >
                +{{ extra.weight }}×{{ extra.repetitions }}
                <span v-if="i !== workout.sets[setIndex - 1].extra.length - 1"
                  >,
                </span>
              </span>
            </span>
          </template>
          <template v-else></template>
        </td>
      </tr>
    </tbody>
  </v-table>

  <p v-else class="no-data">Нет данных о тренировках</p>
</template>

<script setup>
import { computed } from 'vue'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useWorkoutStore } from '@/modules/editor-finance/store/workoutStore'

const workoutStore = useWorkoutStore()
const workouts = computed(() => workoutStore.workouts ?? [])

// Функция форматирования даты
const formatDate = (dateString) => {
  if (!dateString) return '—'
  return format(new Date(dateString), 'dd.MM.yyyy', { locale: ru })
}

// Определяем "зебру" по дате
const getRowClass = (dateString) => {
  const dateIndex = uniqueDates.value.indexOf(formatDate(dateString))
  return dateIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

// Получаем уникальные даты в отсортированном виде
const uniqueDates = computed(() => {
  const dates = new Set(workouts.value.map((w) => formatDate(w.training_date)))
  return [...dates].sort()
})

// Проверяем, есть ли в одной дате разные номера тренировок
const isIncorrectWorkoutNumber = (dateString) => {
  const formattedDate = formatDate(dateString)
  const workoutsOnDate = workouts.value.filter(
    (w) => formatDate(w.training_date) === formattedDate
  )
  const uniqueNumbers = new Set(workoutsOnDate.map((w) => w.workout_number))
  return uniqueNumbers.size > 1
}

// Заголовки таблицы
const headers = [
  { title: 'ID', key: 'workout_id' },
  { title: '№ трени', key: 'workout_number' },
  { title: 'Дата', key: 'training_date' },
  { title: 'Группа', key: 'muscle_group' },
  { title: 'Упражнение', key: 'exercise_name' },
]

// Определяем максимальное количество сетов в тренировке
const maxSetCount = computed(() => {
  return Math.max(
    ...workouts.value.map((workout) =>
      Array.isArray(workout.sets) ? workout.sets.length : 0
    ),
    0
  )
})
</script>

<style scoped>
/* Цвета строк (зебра по дате) */
.even-row {
  background-color: #222; /* Черный */
  color: white;
}

.odd-row {
  background-color: #292929; /* Темно-серый */
  color: white;
}

/* Ошибка: разные номера тренировок в одной дате */
.error-text {
  color: red;
  font-weight: bold;
}

/* Общие стили */
.no-data {
  text-align: center;
  font-size: 1.2rem;
  color: #777;
}

.extra-sets {
  color: grey;
  font-size: 0.8rem;
}
</style>
