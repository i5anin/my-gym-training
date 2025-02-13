<template>
  <div>
    <WorkoutExercise
      class="pt-4 pb-4"
      v-for="(exercise, index) in newWorkout.exercises"
      :key="'exercise-' + index"
      :exercise="exercise"
      :muscleGroups="muscleGroups"
      :exerciseTypes="exerciseTypes"
      :exerciseIndex="index"
      @update:exercise="updateExercise(index, $event)"
      @remove="removeExercise(index)"
    />

    <v-btn @click="addExercise" color="secondary" class="mt-4 mb-4">
      + Добавить упражнение
    </v-btn>
    <v-btn @click="submitWorkout" color="primary" class="mt-4 mb-4 ml-4">
      Добавить тренировку
    </v-btn>
  </div>
</template>

<script setup>
import { useWorkoutStore } from '../store/workoutStore'
import { computed, reactive, defineEmits } from 'vue'
import WorkoutExercise from './WorkoutExercise.vue'

const store = useWorkoutStore()
const muscleGroups = computed(() => store.muscleGroups)
const exerciseTypes = computed(() => store.exerciseTypes)

// Реактивный объект с упражнениями
const newWorkout = reactive(getDefaultWorkout())

const emit = defineEmits(['workoutAdded'])

function submitWorkout() {
  store.addWorkout(newWorkout)
  Object.assign(newWorkout, getDefaultWorkout()) // Сбрасываем состояние
  emit('workoutAdded')
}

function addExercise() {
  newWorkout.exercises.push(getDefaultExercise())
}

function removeExercise(index) {
  newWorkout.exercises.splice(index, 1)
}

function updateExercise(index, updatedExercise) {
  newWorkout.exercises[index] = updatedExercise
}

// Функции генерации данных
function getDefaultWorkout() {
  return { exercises: [getDefaultExercise()] }
}

function getDefaultExercise() {
  return {
    workout_number: '',
    title: '',
    muscle_group_id: null,
    exercise_type_id: null,
    sets: Array.from({ length: 4 }, () => ({
      weight: 0,
      repetitions: 0,
      extra: [],
    })),
  }
}
</script>
