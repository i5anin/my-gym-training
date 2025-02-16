const express = require('express');
const router = express.Router();

const workoutSetsController = require('./controllers/workout-sets.controller');
router.get('/workouts', workoutSetsController.getWorkoutSets);
router.post('/workouts', workoutSetsController.addWorkout);

const exerciseTypesController = require('./controllers/exercise-types.controller');
router.get('/exercise-types', exerciseTypesController.getExerciseTypes);

const muscleGroupsController = require('./controllers/muscle-groups.controller');
router.get('/muscle-groups', muscleGroupsController.getMuscleGroups);

module.exports = router;
