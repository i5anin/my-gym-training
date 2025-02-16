<template>
  <v-table v-if="workouts.length">
    <thead>
    <tr>
      <th v-for="header in headers" :key="header.key">
        {{ header.title }}
      </th>
      <th v-for="(setKey, index) in uniqueSetKeys" :key="'set-' + index">
        {{ setKey }}
      </th>
    </tr>
    </thead>

    <tbody>
    <tr v-for="workout in workouts" :key="workout.workout_id">
      <td>{{ workout.workout_id }}</td>
      <td>{{ workout.workout_number }}</td>
      <td>{{ workout.muscle_group }}</td>
      <td>{{ workout.exercise_type }}</td>
      <td>{{ workout.title }}</td>
      <td>{{ workout.addition_id ?? '—' }}</td>

      <!-- Вывод сетов -->
      <td v-for="(setKey, index) in uniqueSetKeys" :key="'set-' + index">
        <template v-if="workout.sets && workout.sets[setKey]">
          {{ workout.sets[setKey].weight }}×{{ workout.sets[setKey].repetitions }}
          <span
            v-if="Array.isArray(workout.sets[setKey].extra) && workout.sets[setKey].extra.length"
            class="extra-sets"
          >
              <br />
              <span v-for="(extra, i) in workout.sets[setKey].extra" :key="i">
                +{{ extra.weight }}×{{ extra.repetitions }}
                <span v-if="i !== workout.sets[setKey].extra.length - 1">, </span>
              </span>
            </span>
        </template>
        <template v-else>—</template>
      </td>
    </tr>
    </tbody>
  </v-table>

  <p v-else class="no-data">Нет данных о тренировках</p>
</template>

<script setup>
import { computed } from 'vue'
import { useWorkoutStore } from '@/modules/editor-finance/store/workoutStore'

const workoutStore = useWorkoutStore()
const workouts = computed(() => workoutStore.workouts ?? [])

// Заголовки таблицы
const headers = [
  { title: 'ID', key: 'workout_id' },
  { title: 'Номер', key: 'workout_number' },
  { title: 'Группа', key: 'muscle_group' },
  { title: 'Тип', key: 'exercise_type' },
  { title: 'Название', key: 'title' },
  { title: 'Доп. ID', key: 'addition_id' },
]

// Определяем уникальные ключи сетов (set_1, set_2 и т. д.)
const uniqueSetKeys = computed(() => {
  const setKeys = new Set()
  workouts.value.forEach((workout) => {
    if (workout.sets && typeof workout.sets === 'object') {
      Object.keys(workout.sets).forEach((setKey) => setKeys.add(setKey))
    }
  })
  return [...setKeys].sort()
})
</script>

<style scoped>
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
