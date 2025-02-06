<template>
  <v-container>
    <h1>Home Page</h1>

    <!-- Форма для добавления тренировки -->
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

    <!-- Таблица для отображения данных о тренировках -->
    <v-data-table :headers="headers" :items="workouts" item-key="workout_id">
      <template v-slot:item.sets="{ item }">
        <v-simple-table>
          <thead>
            <tr>
              <th>Set Number</th>
              <th>Weight</th>
              <th>Repetitions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(set, index) in item.sets" :key="index">
              <td>{{ set.set_number }}</td>
              <td>{{ set.weight }} kg</td>
              <td>{{ set.repetitions }} reps</td>
            </tr>
          </tbody>
        </v-simple-table>
      </template>
    </v-data-table>

    <!-- Alert если данных нет -->
    <v-alert v-if="workouts.length === 0" type="info"
      >No workouts available</v-alert
    >
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  data() {
    return {
      // Список тренировок
      workouts: [],
      // Заголовки таблицы
      headers: [
        { text: 'Workout ID', value: 'workout_id' },
        { text: 'Workout Number', value: 'workout_number' },
        { text: 'Title', value: 'title' },
        { text: 'Muscle Group', value: 'muscle_group' },
        { text: 'Exercise Type', value: 'exercise_type' },
        { text: 'Sets', value: 'sets' },
      ],
      // Данные для новой тренировки
      newWorkout: {
        workout_number: '',
        title: '',
        muscle_group_id: null,
        exercise_type_id: null,
        sets: [],
      },
      // Список типов упражнений
      exerciseTypes: [],
      // Список групп мышц
      muscleGroups: [],
    }
  },
  mounted() {
    // Получаем данные для выбора (группы мышц и типы упражнений)
    axios
      .get('http://192.168.3.161:4001/api/muscle-groups')
      .then((response) => {
        this.muscleGroups = response.data
      })
      .catch((error) => console.error('Error fetching muscle groups:', error))

    axios
      .get('http://192.168.3.161:4001/api/exercise-types')
      .then((response) => {
        this.exerciseTypes = response.data
      })
      .catch((error) => console.error('Error fetching exercise types:', error))

    // Получаем существующие тренировки
    this.fetchWorkouts()
  },
  methods: {
    // Получаем тренировки с сервера
    fetchWorkouts() {
      axios
        .get('http://192.168.3.161:4001/api/gym')
        .then((response) => {
          this.workouts = response.data.entries || []
        })
        .catch((error) => console.error('Error fetching workouts:', error))
    },
    // Добавляем тренировку
    submitWorkout() {
      axios
        .post('http://192.168.3.161:4001/api/workouts', this.newWorkout)
        .then(() => {
          this.fetchWorkouts()
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
/* Стили для компонента Home */
</style>
