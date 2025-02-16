<template>
  <v-row class="mt-2">
    <input type="hidden" v-model="localExercise.workout_id" />

    <!-- № тренировки -->
    <v-col cols="6" md="1">
      <v-combobox
        clearable
        v-model="localExercise.workout_number"
        label="№ трени"
        required
      />
    </v-col>

    <!-- Дата тренировки (с логами) -->
    <v-col cols="6" md="2">
      <v-menu v-model="datePicker" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-text-field
            v-bind="props"
            clearable
            v-model="formattedDate"
            label="Дата"
            required
            readonly
          />
        </template>
        <v-date-picker
          v-model="localExercise.training_date"
          locale="ru"
          first-day-of-week="1"
          @update:model-value="updateDate"
        />
      </v-menu>
    </v-col>

    <!-- Группа мышц -->
    <v-col cols="6" md="2">
      <v-combobox
        clearable
        v-model="localExercise.muscle_group_id"
        :items="muscleGroups"
        label="Группа"
        item-title="name"
        item-value="id"
        required
      />
    </v-col>

    <!-- Название упражнения -->
    <v-col cols="6" md="3">
      <v-combobox
        clearable
        v-model="localExercise.exercise_id"
        :items="exercises"
        label="Название"
        item-title="title"
        item-value="id"
        required
        @update:model-value="updateSymbol"
      />
    </v-col>

    <!-- Обозначение -->
    <v-col cols="6" md="3">
      <v-combobox
        v-model="localExercise.symbol"
        :items="exercises"
        label="Обозначение"
        item-title="symbol"
        item-value="id"
        required
        @update:model-value="updateSymbol"
      />
    </v-col>

    <!-- ID добивки -->
    <v-col cols="6" md="1">
      <v-combobox
        clearable
        v-model="localExercise.addition_id"
        :items="workoutOptions"
        label="ID добивки"
        item-title="workout_number"
        item-value="id"
      />
    </v-col>

    <!-- Кнопка удаления -->
    <v-col cols="6" md="2" v-if="exerciseIndex > 0">
      <v-btn @click="$emit('remove')" color="error">Удалить</v-btn>
    </v-col>
  </v-row>

  <!-- Сеты -->
  <v-row v-for="(set, setIndex) in localExercise.sets" :key="setIndex">
    <v-col cols="6" md="4">
      <v-text-field
        v-model="set.formattedValue"
        label="Вес (кг) × Повторения"
        @input="updateSet(set)"
      />
    </v-col>

    <WorkoutDropSet
      v-for="(dropSet, dropIndex) in set.extra"
      :key="dropIndex"
      :dropSet="dropSet"
      @remove="removeDropSet(setIndex, dropIndex)"
    />

    <v-btn
      variant="text"
      @click="addDropSet(setIndex)"
      color="secondary"
      class="mt-2"
      tabindex="-1"
    >
      + Добивка
    </v-btn>
  </v-row>
</template>

<script setup>
import { ref, watchEffect, defineProps, defineEmits } from 'vue'
import WorkoutDropSet from './WorkoutDropSet.vue'

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
  training_date: null,
  muscle_group_id: null,
  exercise_id: null,
  symbol: '',
  addition_id: null,
  sets: [],
})

const datePicker = ref(false)
const formattedDate = ref('')

// ✅ Теперь обновляем `localExercise`, не теряя `training_date`
watchEffect(() => {
  if (props.exercise) {
    Object.assign(localExercise.value, props.exercise)
    console.log('[watchEffect] localExercise обновлен:', localExercise.value)
  }
  updateFormattedDate()
})

// ✅ Форматирование даты в `dd.MM.yyyy`
function updateFormattedDate() {
  let date = localExercise.value.training_date
  if (!date) {
    formattedDate.value = ''
    return
  }

  if (!(date instanceof Date)) {
    date = new Date(date)
  }

  if (isNaN(date.getTime())) {
    formattedDate.value = 'Ошибка даты'
    return
  }

  formattedDate.value = date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// ✅ Обновляет `training_date` и `formattedDate`
function updateDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }

  if (isNaN(date.getTime())) {
    return
  }

  localExercise.value.training_date = date
  updateFormattedDate()
  datePicker.value = false
}

function addDropSet(setIndex) {
  localExercise.value.sets[setIndex].extra.push({ weight: '', repetitions: '' })
}

function removeDropSet(setIndex, dropIndex) {
  localExercise.value.sets[setIndex].extra.splice(dropIndex, 1)
}
</script>

