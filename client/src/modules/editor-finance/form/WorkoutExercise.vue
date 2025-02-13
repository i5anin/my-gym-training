<template>
  <v-row class="mt-2">
    <v-col cols="6" md="3">
      <v-combobox
        clearable
        v-model="localExercise.workout_number"
        label="№ тренировки"
        required
      />
    </v-col>
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
        v-model="localExercise.muscle_group_id"
        :items="muscleGroups"
        label="Группа мышц"
        item-text="name"
        item-value="id"
        required
      />
    </v-col>
    <v-col cols="6" md="3">
      <v-combobox
        clearable
        v-model="localExercise.exercise_type_id"
        :items="exerciseTypes"
        label="Тип упражнения"
        item-text="name"
        item-value="id"
        required
      />
    </v-col>

    <!-- Удаление упражнения (скрыто для первого упражнения) -->
    <v-col cols="6" md="2" v-if="exerciseIndex > 0">
      <v-btn @click="$emit('remove')" color="error">Удалить</v-btn>
    </v-col>
  </v-row>

  <!-- Отображение 4 сетов -->
  <v-row v-for="(set, setIndex) in localExercise.sets" :key="'set-' + setIndex">
    <v-col cols="6" md="2">
      <v-text-field v-model="set.weight" label="Вес (кг)" type="number" />
    </v-col>
    <v-col cols="6" md="2">
      <v-text-field
        v-model="set.repetitions"
        label="Количество"
        type="number"
      />
    </v-col>

    <!-- Добивки -->
    <WorkoutDropSet
      v-for="(dropSet, dropIndex) in set.extra"
      :key="'dropSet-' + dropIndex"
      :dropSet="dropSet"
      @remove="removeDropSet(setIndex, dropIndex)"
    />

    <!-- Кнопка добавления добивки к конкретному сету -->
    <v-btn
      variant="text"
      @click="addDropSet(setIndex)"
      color="secondary"
      class="mt-2"
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
  exerciseIndex: Number, // Передаем индекс упражнения
})

// Определяем события
const emit = defineEmits(['update:exercise', 'remove'])

// Создаём реактивную копию пропа
const localExercise = ref({ ...props.exercise })

// Следим за изменениями localExercise и передаём их родителю
watch(
  localExercise,
  (newValue) => {
    emit('update:exercise', newValue)
  },
  { deep: true }
)

// Добавление добивки в конкретный set.extra
function addDropSet(setIndex) {
  localExercise.value.sets[setIndex].extra.push({ weight: '', repetitions: '' })
}

// Удаление добивки из конкретного set.extra
function removeDropSet(setIndex, dropIndex) {
  localExercise.value.sets[setIndex].extra.splice(dropIndex, 1)
}
</script>
