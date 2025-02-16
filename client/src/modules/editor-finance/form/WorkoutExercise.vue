<template>
  <v-row class="mt-2">
    <!-- ID тренировки (скрыто) -->
    <input type="hidden" v-model="localExercise.workout_id" />

    <!-- № трен -->
    <v-col cols="6" md="1">
      <v-combobox
        clearable
        v-model="localExercise.workout_number"
        label="№ трени"
        required
      />
    </v-col>

    <!-- Дата тренировки -->
    <v-col cols="6" md="2">
      <v-menu v-model="datePicker" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-text-field
            v-bind="props"
            clearable
            v-model="localExercise.training_date"
            label="Дата"
            required
          />
        </template>
        <v-date-picker
          v-model="localExercise.training_date"
          @update:model-value="datePicker = false"
        />
      </v-menu>
    </v-col>

    <!-- Группа мышц -->
    <v-col cols="6" md="3">
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
        v-model="localExercise.title"
        label="Название"
        required
      />
    </v-col>

    <v-col cols="6" md="3">
      <v-combobox
        clearable
        v-model="localExercise.symbol"
        label="Обозначение"
        required
      />
    </v-col>

    <v-col cols="6" md="2">
      <v-combobox
        clearable
        v-model="localExercise.symbol"
        label="ID обивки"
        required
      />
    </v-col>

    <!-- Кнопка удаления упражнения (не отображается для первого элемента) -->
    <v-col cols="6" md="2" v-if="exerciseIndex > 0">
      <v-btn @click="$emit('remove')" color="error">Удалить</v-btn>
    </v-col>
  </v-row>

  <!-- Отображение 4 сетов -->
  <v-row v-for="(set, setIndex) in localExercise.sets" :key="'set-' + setIndex">
    <v-col cols="6" md="3">
      <v-text-field
        v-model="set.value"
        label="Вес (кг) × Количество"
        @input="updateSet(set, set.value)"
      />
    </v-col>

    <!-- Добивки -->
    <WorkoutDropSet
      v-for="(dropSet, dropIndex) in set.extra"
      :key="'dropSet-' + dropIndex"
      :dropSet="dropSet"
      @remove="removeDropSet(setIndex, dropIndex)"
    />

    <!-- Кнопка добавления добивки -->
    <v-btn
      variant="text"
      @click="addDropSet(setIndex)"
      color="secondary"
      class="mt-2"
      tabindex="-1"
    >+ Добивка
    </v-btn>
  </v-row>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import WorkoutDropSet from './WorkoutDropSet.vue'

// Определяем пропсы
const props = defineProps({
  exercise: Object,
  muscleGroups: Array,
  exerciseTypes: Array,
  exerciseIndex: Number, // Индекс упражнения
})

// Определяем события
const emit = defineEmits(['update:exercise', 'remove'])

// Локальная копия объекта упражнения
const localExercise = ref({ ...props.exercise })

// Слежение за изменениями и передача их родителю
watch(
  localExercise,
  (newValue) => {
    emit('update:exercise', newValue)
  },
  { deep: true }
)

// Управление выбором даты
const datePicker = ref(false)

// Функция для обновления веса и повторений
function updateSet(set, value) {
  const parts = value
    .split(' ')
    .map((p) => p.trim())
    .filter(Boolean)
  set.weight = parts[0] || ''
  set.repetitions = parts[1] || ''
  set.value = `${set.weight} ${set.repetitions}`.trim()
}

// Добавление добивки
function addDropSet(setIndex) {
  localExercise.value.sets[setIndex].extra.push({
    weight: '',
    repetitions: '',
    value: '',
  })
}

// Удаление добивки
function removeDropSet(setIndex, dropIndex) {
  localExercise.value.sets[setIndex].extra.splice(dropIndex, 1)
}
</script>
