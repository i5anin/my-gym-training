<template>
  <v-container>
    <v-table>
      <thead>
        <tr>
          <th v-for="header in headers" :key="header.key">
            {{ header.title }}
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
          <td>
            <template v-if="workout.sets">
              <div v-for="(set, key) in workout.sets" :key="key">
                <strong>{{ key }}:</strong>
                {{ set.weight }} кг × {{ set.repetitions }}
                <span v-if="set.extra.length">
                  (доп:
                  <span v-for="(extra, i) in set.extra" :key="i">
                    {{ extra.weight }} кг × {{ extra.repetitions }}
                    <span v-if="i !== set.extra.length - 1">, </span> </span
                  >)
                </span>
              </div>
            </template>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkoutStore } from './store/workoutStore'

const workoutStore = useWorkoutStore()
const { workouts } = storeToRefs(workoutStore) // ✅ Теперь `workouts` — массив

const headers = ref([
  { title: 'ID', key: 'workout_id' },
  { title: 'Номер тренировки', key: 'workout_number' },
  { title: 'Группа мышц', key: 'muscle_group' },
  { title: 'Тип упражнения', key: 'exercise_type' },
  { title: 'Название', key: 'title' },
  { title: 'Доп. ID', key: 'addition_id' },
  { title: 'Количество подходов', key: 'sets' },
])
</script>
