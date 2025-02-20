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
        :class="[getRowClass(workout.training_date, uniqueDates)]"
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
        <td :title="workout.exercise_symbol">{{ workout.exercise_name }}</td>

        <!-- Вывод сетов -->
        <td v-for="setIndex in maxSetCount" :key="'set-' + setIndex">
          <WorkoutSet
            v-if="workout.sets && workout.sets[setIndex - 1]"
            :set="workout.sets[setIndex - 1]"
          />
        </td>
      </tr>
    </tbody>
  </v-table>

  <p v-else class="no-data">Нет данных о тренировках</p>
</template>

<script setup>
import { computed } from 'vue'
import {
  formatDate,
  getRowClass,
  isIncorrectWorkoutNumber,
} from '../utils/dateUtils'
import { useWorkoutStore } from '../store/workoutStore'
import WorkoutSet from './WorkoutSet.vue'

const workoutStore = useWorkoutStore()
const workouts = computed(() => workoutStore.workouts ?? [])
const maxSetCount = computed(() => {
  if (workouts.value.length === 0) return 0
  return Math.max(...workouts.value.map((workout) => workout.sets.length))
})

const headers = workoutStore.headers

// Получаем уникальные даты
const uniqueDates = computed(() => {
  const dates = workouts.value.map((workout) =>
    formatDate(workout.training_date)
  )
  return [...new Set(dates)]
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
