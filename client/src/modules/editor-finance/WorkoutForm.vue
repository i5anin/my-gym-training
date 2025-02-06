<template>
  <v-form @submit.prevent="submitWorkout">
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="newWorkout.workout_number"
          label="Workout Number"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="newWorkout.title"
          label="Workout Title"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="newWorkout.muscle_group_id"
          :items="muscleGroups"
          label="Muscle Group"
          item-text="name"
          item-value="id"
          required
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="newWorkout.exercise_type_id"
          :items="exerciseTypes"
          label="Exercise Type"
          item-text="name"
          item-value="id"
          required
        ></v-select>
      </v-col>
    </v-row>

    <v-btn type="submit" color="primary">Add Workout</v-btn>
  </v-form>
</template>

<script>
// Импортируем API-сервис
import { workoutApi } from './api/workoutApi'

export default {
  name: 'WorkoutForm',
  props: {
    muscleGroups: Array,
    exerciseTypes: Array,
  },
  data() {
    return {
      newWorkout: {
        workout_number: '',
        title: '',
        muscle_group_id: null,
        exercise_type_id: null,
        sets: [],
      },
    }
  },
  methods: {
    // Добавляем тренировку
    submitWorkout() {
      workoutApi
        .addWorkout(this.newWorkout)
        .then(() => {
          this.$emit('workoutAdded') // Оповещаем родительский компонент о добавлении тренировки
          this.newWorkout = {
            workout_number: '',
            title: '',
            muscle_group_id: null,
            exercise_type_id: null,
            sets: [],
          }
        })
        .catch((error) => console.error('Error adding workout:', error))
    },
  },
}
</script>

<style scoped>
/* Стили для формы добавления тренировки */
</style>
