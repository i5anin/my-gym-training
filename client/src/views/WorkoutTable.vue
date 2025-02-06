<template>
  <v-table>
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
      <tr v-for="(workout, index) in workouts" :key="index">
        <td>{{ workout.workout_id }}</td>
        <td>{{ workout.workout_number }}</td>
        <td>{{ workout.muscle_group }}</td>
        <td>{{ workout.exercise_type }}</td>
        <td>{{ workout.title }}</td>
        <td>{{ workout.addition_id }}</td>

        <!-- Выводим сеты -->
        <td v-for="(setKey, index) in uniqueSetKeys" :key="'set-' + index">
          <template v-if="workout.sets && workout.sets[setKey]">
            {{ workout.sets[setKey].weight }}×{{
              workout.sets[setKey].repetitions
            }}
            <span
              v-if="workout.sets[setKey].extra.length"
              :style="{ color: 'grey', fontSize: '0.8rem' }"
            >
              <br />
              <span v-for="(extra, i) in workout.sets[setKey].extra" :key="i">
                +{{ extra.weight }}×{{ extra.repetitions }}
                <span v-if="i !== workout.sets[setKey].extra.length - 1"
                  >,
                </span>
              </span>
            </span>
          </template>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkoutStore } from './store/workoutStore'

const workoutStore = useWorkoutStore()
const { workouts } = storeToRefs(workoutStore) // ✅ Теперь `workouts` — массив

const headers = ref([
  { title: 'ID', key: 'workout_id' },
  { title: 'Номер', key: 'workout_number' },
  { title: 'Группа', key: 'muscle_group' },
  { title: 'Тип упражнения', key: 'exercise_type' },
  { title: 'Название', key: 'title' },
  { title: 'Доп. ID', key: 'addition_id' },
])

// Находим все уникальные ключи сетов (set_1, set_2 и т. д.)
const uniqueSetKeys = computed(() => {
  const setKeys = new Set()
  workouts.value.forEach((workout) => {
    if (workout.sets) {
      Object.keys(workout.sets).forEach((setKey) => setKeys.add(setKey))
    }
  })
  return Array.from(setKeys).sort() // Сортируем, чтобы порядок был одинаковый
})
</script>
