<template>
  <v-container class="container-lg" fluid>
    <h1>Home Page</h1>

    <WorkoutForm
      :muscleGroups="muscleGroups"
      :exerciseTypes="exerciseTypes"
      @workoutAdded="fetchWorkouts"
    />

    <WorkoutTable :workouts="workouts" />
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkoutStore } from '@/modules/editor-finance/store/workoutStore'
import WorkoutForm from './form/WorkoutForm.vue'
import WorkoutTable from './WorkoutTable.vue'

const workoutStore = useWorkoutStore()
const { workouts, muscleGroups, exerciseTypes } = storeToRefs(workoutStore) // ✅ Теперь workouts реактивный
const { fetchWorkouts } = workoutStore

onMounted(() => {
  workoutStore.fetchData()
})
</script>

<style>
.full-height {
  min-height: 100vh; /* Минимальная высота - 100% экрана */
  display: flex;
  flex-direction: column;
}
</style>
