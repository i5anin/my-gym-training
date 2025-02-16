// src/api/workoutApi.js
import axiosInstance from '@/api/axiosConfig'
import { handleApiError, handleResponse } from '@/api/errorHandler'

export const workoutApi = {
  getWorkouts: () =>
    axiosInstance.get('/workouts').then(handleResponse).catch(handleApiError),
  getMuscleGroups: () =>
    axiosInstance
      .get('/muscle-groups')
      .then(handleResponse)
      .catch(handleApiError),
  getExerciseTypes: () =>
    axiosInstance
      .get('/exercise-types')
      .then(handleResponse)
      .catch(handleApiError),
  addWorkout: (workoutData) =>
    axiosInstance
      .post('/workouts', workoutData)
      .then(handleResponse)
      .catch(handleApiError),
}
