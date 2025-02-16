<template>
  <v-row class="mt-2">
    <input type="hidden" v-model="localExercise.workout_id" />

    <!-- № тренировки -->
    <v-col cols="6" md="1">
      <v-combobox clearable v-model="localExercise.workout_number" label="№ трени" required />
    </v-col>

    <!-- Дата тренировки -->
    <v-col cols="6" md="2">
      <v-menu v-model="datePicker" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-text-field v-bind="props" clearable v-model="localExercise.training_date" label="Дата" required readonly />
        </template>
        <v-date-picker v-model="localExercise.training_date" @update:model-value="datePicker = false" />
      </v-menu>
    </v-col>

    <!-- Группа мышц -->
    <v-col cols="6" md="2">
      <v-combobox clearable v-model="localExercise.muscle_group_id" :items="muscleGroups" label="Группа" item-title="name" item-value="id" required />
    </v-col>

    <!-- Название упражнения -->
    <v-col cols="6" md="3">
      <v-combobox clearable v-model="localExercise.exercise_id" :items="exercises" label="Название" item-title="title" item-value="id" required @update:model-value="updateSymbol" />
    </v-col>

    <!-- Обозначение -->
    <v-col cols="6" md="3">
      <v-combobox v-model="localExercise.symbol" :items="exercises" label="Обозначение" item-title="symbol" item-value="id" required @update:model-value="updateSymbol" />
    </v-col>

    <!-- ID добивки -->
    <v-col cols="6" md="1">
      <v-combobox clearable v-model="localExercise.addition_id" :items="workoutOptions" label="ID добивки" item-title="workout_number" item-value="id" />
    </v-col>

    <!-- Кнопка удаления -->
    <v-col cols="6" md="2" v-if="exerciseIndex > 0">
      <v-btn @click="$emit('remove')" color="error">Удалить</v-btn>
    </v-col>
  </v-row>

  <!-- Сеты -->
  <v-row v-for="(set, setIndex) in localExercise.sets" :key="setIndex">
    <v-col cols="6" md="4">
      <v-text-field v-model="set.formattedValue" label="Вес (кг) × Повторения" @input="updateSet(set)" />
    </v-col>

    <WorkoutDropSet v-for="(dropSet, dropIndex) in set.extra" :key="dropIndex" :dropSet="dropSet" @remove="removeDropSet(setIndex, dropIndex)" />

    <v-btn variant="text" @click="addDropSet(setIndex)" color="secondary" class="mt-2" tabindex="-1">
      + Добивка
    </v-btn>
  </v-row>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, watchEffect } from 'vue'
import WorkoutDropSet from './WorkoutDropSet.vue'
import { VDatePicker } from 'vuetify/components'

const props = defineProps({
  exercise: Object,
  muscleGroups: Array,
  exercises: Array,
  workoutOptions: Array,
  exerciseIndex: Number,
})

const emit = defineEmits(['update:exercise', 'remove'])

const localExercise = ref({
  workout_id: '',
  workout_number: '',
  training_date: null, // Должно быть `null`, иначе v-date-picker может не работать
  muscle_group_id: null,
  exercise_id: null,
  symbol: '',
  addition_id: null,
  sets: [],
})

// ✅ Следит за изменениями props.exercise и обновляет localExercise
watchEffect(() => {
  if (props.exercise) {
    localExercise.value = { ...props.exercise }
  }
})

// ✅ Следит за props.exercise и не даёт `training_date` быть пустым
watch(
  () => props.exercise,
  (newVal) => {
    if (newVal) {
      localExercise.value.workout_number = newVal.workout_number || ''
      localExercise.value.training_date = newVal.training_date || null
    }
  },
  { deep: true, immediate: true }
)

const datePicker = ref(false)

function updateSymbol(exerciseId) {
  const selectedExercise = props.exercises.find((ex) => ex.id === exerciseId)
  localExercise.value.symbol = selectedExercise?.symbol ?? ''
}

function updateSet(set) {
  const rawInput = set.formattedValue.replace(/[^0-9 ]/g, '')
  const parts = rawInput.split(' ')

  set.weight = parts[0] ? parseFloat(parts[0]) : ''
  set.repetitions = parts[1] ? parseInt(parts[1], 10) : ''

  set.formattedValue = rawInput
}

function addDropSet(setIndex) {
  localExercise.value.sets[setIndex].extra.push({
    weight: '',
    repetitions: '',
  })
}

function removeDropSet(setIndex, dropIndex) {
  localExercise.value.sets[setIndex].extra.splice(dropIndex, 1)
}
</script>
