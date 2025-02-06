// store/workoutStore.js
import { defineStore } from 'pinia'
import { workoutApi } from '../api/workoutApi'

export const useWorkoutStore = defineStore('workout', {
  state: () => ({
    workouts: [],
    muscleGroups: [],
    exerciseTypes: [],
  }),
  actions: {
    async fetchData() {
      try {
        this.muscleGroups = await workoutApi.getMuscleGroups()
        this.exerciseTypes = await workoutApi.getExerciseTypes()
        await this.fetchWorkouts()
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
      }
    },
    async fetchWorkouts() {
      try {
        const data = await workoutApi.getWorkouts()
        this.workouts = data?.entries || []
      } catch (error) {
        console.error('Ошибка загрузки тренировок:', error)
      }
    },
  },
})
