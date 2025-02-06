<template>
  <v-form @submit.prevent="submitWorkout">
    <v-row v-for="(exercise, exerciseIndex) in newWorkout.exercises" :key="'exercise-' + exerciseIndex">
      <v-col cols="6" md="2">
        <v-text-field
          v-model="exercise.workout_number"
          label="Workout Number"
          required
        />
      </v-col>
      <v-col cols="6" md="2">
        <v-text-field
          v-model="exercise.title"
          label="Workout Title"
          required
        />
      </v-col>
      <v-col cols="6" md="2">
        <v-select
          v-model="exercise.muscle_group_id"
          :items="muscleGroups"
          label="Muscle Group"
          item-text="name"
          item-value="id"
          required
        />
      </v-col>
      <v-col cols="6" md="2">
        <v-select
          v-model="exercise.exercise_type_id"
          :items="exerciseTypes"
          label="Exercise Type"
          item-text="name"
          item-value="id"
          required
        />
      </v-col>
      <v-col cols="6" md="2">
        <v-btn @click="removeExercise(exerciseIndex)" color="error">Удалить упражнение</v-btn>
      </v-col>

      <!-- Основной сет -->
      <v-row>
        <v-col cols="6" md="2">
          <v-text-field
            v-model="exercise.weight"
            label="Вес (кг)"
            type="number"
            required
          />
        </v-col>
        <v-col cols="6" md="2">
          <v-text-field
            v-model="exercise.repetitions"
            label="Повторения"
            type="number"
            required
          />
        </v-col>
      </v-row>

      <!-- Добивки -->
      <v-row v-for="(dropSet, dropIndex) in exercise.extra" :key="'drop-' + exerciseIndex + '-' + dropIndex">
        <v-col cols="6" md="2">
          <v-text-field
            v-model="dropSet.weight"
            label="Добивка: Вес (кг)"
            type="number"
          />
        </v-col>
        <v-col cols="6" md="2">
          <v-text-field
            v-model="dropSet.repetitions"
            label="Добивка: Повторения"
            type="number"
          />
        </v-col>
        <v-col cols="6" md="2">
          <v-btn @click="removeDropSet(exerciseIndex, dropIndex)" color="error">Удалить добивку</v-btn>
        </v-col>
      </v-row>

      <v-btn @click="addDropSet(exerciseIndex)" color="secondary" class="mt-2">+ Добивка</v-btn>
    </v-row>

    <v-btn @click="addExercise" color="secondary" class="mt-4">+ Добавить упражнение</v-btn>
    <v-btn type="submit" color="primary" class="mt-4">Добавить тренировку</v-btn>
  </v-form>
</template>

<script>
import {workoutApi} from './api/workoutApi'

export default {
  name: 'WorkoutForm',
  props: {
    muscleGroups: Array,
    exerciseTypes: Array,
  },
  data() {
    return {
      newWorkout: this.getDefaultWorkout(),
    }
  },
  methods: {
    submitWorkout() {
      workoutApi
        .addWorkout(this.newWorkout)
        .then(() => {
          this.$emit('workoutAdded')
          this.resetForm()
        })
        .catch(console.error)
    },
    addExercise() {
      this.newWorkout.exercises.push(this.getDefaultExercise())
    },
    removeExercise(index) {
      this.newWorkout.exercises.splice(index, 1)
    },
    addDropSet(exerciseIndex) {
      this.newWorkout.exercises[exerciseIndex].extra.push({
        weight: '',
        repetitions: '',
      })
    },
    removeDropSet(exerciseIndex, dropIndex) {
      this.newWorkout.exercises[exerciseIndex].extra.splice(dropIndex, 1)
    },
    resetForm() {
      this.newWorkout = this.getDefaultWorkout()
    },
    getDefaultWorkout() {
      return {
        exercises: [this.getDefaultExercise()],
      }
    },
    getDefaultExercise() {
      return {
        workout_number: '',
        title: '',
        muscle_group_id: null,
        exercise_type_id: null,
        weight: '',
        repetitions: '',
        extra: [], // Массив добивок
      }
    },
  },
}
</script>
