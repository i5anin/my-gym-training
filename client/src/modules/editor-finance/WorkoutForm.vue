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

      <!-- Сеты -->
      <v-row v-for="(set, setIndex) in exercise.sets" :key="'set-' + exerciseIndex + '-' + setIndex">
        <v-col cols="6" md="2">
          <v-text-field
            v-model="set.weight"
            label="Вес (кг)"
            type="number"
            required
          />
        </v-col>
        <v-col cols="6" md="2">
          <v-text-field
            v-model="set.repetitions"
            label="Повторения"
            type="number"
            required
          />
        </v-col>
        <v-col cols="6" md="2">
          <v-btn @click="addDropSet(exerciseIndex, setIndex)" color="secondary">+ Добивка</v-btn>
        </v-col>
        <v-col cols="6" md="2">
          <v-btn @click="removeSet(exerciseIndex, setIndex)" color="error">Удалить сет</v-btn>
        </v-col>

        <!-- Добивки -->
        <v-row v-for="(dropSet, dropIndex) in set.extra" :key="'drop-' + exerciseIndex + '-' + setIndex + '-' + dropIndex">
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
            <v-btn @click="removeDropSet(exerciseIndex, setIndex, dropIndex)" color="error">Удалить добивку</v-btn>
          </v-col>
        </v-row>
      </v-row>

      <v-btn v-if="canAddSet(exercise)" @click="addSet(exerciseIndex)" color="secondary" class="mt-2">+ Сет</v-btn>
    </v-row>

    <v-btn @click="addExercise" color="secondary" class="mt-4">+ Добавить упражнение</v-btn>
    <v-btn type="submit" color="primary" class="mt-4">Добавить тренировку</v-btn>
  </v-form>
</template>

<script>
import { workoutApi } from './api/workoutApi'

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
    addSet(exerciseIndex) {
      if (this.canAddSet(this.newWorkout.exercises[exerciseIndex])) {
        this.newWorkout.exercises[exerciseIndex].sets.push(this.getDefaultSet())
      }
    },
    removeSet(exerciseIndex, setIndex) {
      this.newWorkout.exercises[exerciseIndex].sets.splice(setIndex, 1)
    },
    addDropSet(exerciseIndex, setIndex) {
      this.newWorkout.exercises[exerciseIndex].sets[setIndex].extra.push({
        weight: '',
        repetitions: '',
      })
    },
    removeDropSet(exerciseIndex, setIndex, dropIndex) {
      this.newWorkout.exercises[exerciseIndex].sets[setIndex].extra.splice(dropIndex, 1)
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
        sets: [this.getDefaultSet()],
      }
    },
    getDefaultSet() {
      return {
        weight: '',
        repetitions: '',
        extra: [],
      }
    },
    canAddSet(exercise) {
      return exercise.sets.length < 6
    },
  },
}
</script>
