const express = require('express');
const router = express.Router();

// Контроллеры для тренировок и меток
const workoutController = require('./controllers/b_workouts'); // Контроллер для тренировок
const markerController = require('./controllers/b_custom_mark'); // Контроллер для меток
const dbController = require('./controllers/b_excel'); // Контроллер для работы с БД

// Запрос для получения всех тренировок
router.get('/gym', workoutController.getWorkoutSets);

// Запрос для получения уникальных типов упражнений
router.get('/exercise-types', workoutController.getExerciseTypes);

// Запрос для получения уникальных групп мышц
router.get('/muscle-groups', workoutController.getMuscleGroups);

// Запрос для добавления тренировки и подходов (POST-запрос)
router.post('/workouts', workoutController.addWorkout);

module.exports = router;
