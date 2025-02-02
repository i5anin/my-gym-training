SELECT
	t_trainings.training_number,
	t_trainings.muscle_group,
	t_trainings.training_type,
	t_exercises.NAME,
	t_exercises.description,
	t_exercises.exercise_type,
	t_sets.set_number,
	t_sets.reps,
	t_sets.weight,
	t_sets.TIME
FROM
	t_trainings
	JOIN t_training_exercises ON t_trainings.ID = t_training_exercises.training_id
	JOIN t_exercises ON t_training_exercises.exercise_id = t_exercises.
	ID LEFT JOIN t_sets ON t_exercises.ID = t_sets.exercise_id
ORDER BY
	t_training_exercises.order,
	t_sets.set_number