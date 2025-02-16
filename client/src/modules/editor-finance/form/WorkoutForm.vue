<template>
  <div>
    <!-- Упражнения -->
    <WorkoutExercise
      v-for="(exercise, index) in newWorkout.exercises"
      :key="'exercise-' + index"
      :exercise="exercise"
      :muscleGroups="muscleGroups"
      :exercises="exercises"
      :exerciseIndex="index"
      @update:exercise="updateExercise(index, $event)"
      @remove="removeExercise(index)"
    />

    <!-- Кнопки -->
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
import { computed, reactive, defineEmits, ref } from 'vue'
import WorkoutExercise from './WorkoutExercise.vue'

const store = useWorkoutStore()
const muscleGroups = computed(() => store.muscleGroups)
const exercises = computed(() => store.exercises)

const newWorkout = reactive(getDefaultWorkout())
const datePicker = ref(false) // Управление календарём

const emit = defineEmits(['workoutAdded'])

async function submitWorkout() {
  await store.addWorkout(formatWorkout(newWorkout))
  Object.assign(newWorkout, getDefaultWorkout()) // Сброс
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

// Форматирование данных перед отправкой
function formatWorkout(workout) {
  return {
    workout_number: workout.workout_number,
    training_date: workout.training_date,
    exercises: workout.exercises.map((ex) => ({
      exercise_id: ex.exercise_id,
      muscle_group_id: ex.muscle_group_id,
      sets: ex.sets.map((set) => ({
        weight: set.weight,
        repetitions: set.repetitions,
        extra: set.extra.map((extra) => ({
          weight: extra.weight,
          repetitions: extra.repetitions,
        })),
      })),
    })),
  }
}

// Функции генерации данных
function getDefaultWorkout() {
  return {
    workout_number: '',
    training_date: null, // Теперь значение по умолчанию `null`
    exercises: [getDefaultExercise()],
  }
}

function getDefaultExercise() {
  return {
    exercise_id: null,
    muscle_group_id: null,
    sets: Array.from({ length: 4 }, () => ({
      weight: 0,
      repetitions: 0,
      extra: [],
    })),
  }
}
</script>
