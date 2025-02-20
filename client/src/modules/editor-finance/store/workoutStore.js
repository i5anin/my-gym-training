import { defineStore } from 'pinia'
import { workoutApi } from '../api/workoutApi'

export const useWorkoutStore = defineStore('workout', {
  state: () => ({
    workouts: [],
    muscleGroups: [],
    exerciseTypes: [],
    exercises: [],
    headers: [
      { title: 'ID', key: 'workout_id' },
      { title: '№ трени', key: 'workout_number' },
      { title: 'Дата', key: 'training_date' },
      { title: 'Группа', key: 'muscle_group' },
      { title: 'Упражнение', key: 'exercise_name' },
    ],
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
