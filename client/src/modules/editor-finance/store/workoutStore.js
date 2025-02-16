import { defineStore } from 'pinia'
import { workoutApi } from '../api/workoutApi'

export const useWorkoutStore = defineStore('workout', {
  state: () => ({
    workouts: [],
    muscleGroups: [],
    exerciseTypes: [],
    exercises: [],
  }),
  actions: {
    async fetchData() {
      try {
        const [muscleGroups, exerciseTypes, workouts] = await Promise.all([
          workoutApi.getMuscleGroups(),
          workoutApi.getExerciseTypes(),
          workoutApi.getWorkouts(),
        ])
        this.muscleGroups = muscleGroups
        this.exercises = exerciseTypes
        this.workouts = workouts
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
      }
    },
    async addWorkout(workout) {
      try {
        await workoutApi.addWorkout(workout)
        await this.fetchData()
      } catch (error) {
        console.error('Ошибка добавления тренировки:', error)
      }
    },
  },
})
