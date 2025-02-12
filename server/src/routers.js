const express = require('express');
const router = express.Router();

// Контроллеры для тренировок и меток
const workoutController = require('./controllers/b_workouts'); // Контроллер для тренировок

// Запрос для получения всех тренировок
router.get('/workouts', workoutController.getWorkoutSets);

router.post('/workouts/extended', workoutController.addWorkoutWithSets);

// Запрос для получения уникальных типов упражнений
router.get('/exercise-types', workoutController.getExerciseTypes);

// Запрос для получения уникальных групп мышц
router.get('/muscle-groups', workoutController.getMuscleGroups);

// Запрос для добавления тренировки и подходов (POST-запрос)
router.post('/workouts', workoutController.addWorkout);

module.exports = router;
