const {Pool} = require('pg')
const {getNetworkDetails} = require('../db_type')
const config = require('../config')

const networkDetails = getNetworkDetails()
const dbConfig = networkDetails.databaseType === 'build' ? config.dbConfig : config.dbConfigTest

// Создание пула соединений с базой данных
const pool = new Pool(dbConfig)

async function addWorkoutWithSets(req, res) {
    try {
        const {
            workout_number,
            muscle_group_id,
            exercise_type_id,
            title,
            barbell_weight,
            training_date = new Date().toISOString().split('T')[0], // По умолчанию текущая дата
            description = null,
            description_position = null,
            addition_id = null,
            series_id = null,
            sets = []
        } = req.body;

        const client = await pool.connect();
        try {
            // Вставляем новую тренировку
            const workoutQuery = `
                INSERT INTO workout (
                    workout_number, muscle_group_id, exercise_type_id, title,
                    barbell_weight, training_date, description, description_position,
                    addition_id, series_id
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING id;
            `;

            const {rows} = await client.query(workoutQuery, [
                workout_number, muscle_group_id, exercise_type_id, title,
                barbell_weight, training_date, description, description_position,
                addition_id, series_id
            ]);

            const workout_id = rows[0].id;

            // Вставляем подходы
            if (sets.length > 0) {
                const setQuery = `
                    INSERT INTO workout_set (workout_id, set_number, weight, repetitions)
                    VALUES ${sets.map((_, i) => `(${workout_id}, $${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(', ')};
                `;

                const setValues = sets.flatMap(({set_number, weight, repetitions}) => [
                    set_number, weight, repetitions
                ]);

                await client.query(setQuery, setValues);
            }

            res.json({workout_id, message: "Тренировка добавлена"});
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Ошибка при добавлении тренировки:", error);
        res.status(500).send(error.message);
    }
}


async function getWorkoutSets(req, res) {
    try {
        const query = `
     SELECT 
    w.workout_number,
    jsonb_agg(
        jsonb_build_object(
            'workout_id', w.id,
            'muscle_group', mg.name,
            'exercise_type', et.name,
            'title', w.title,
            'addition_id', w.addition_id,
            'sets', (
                SELECT jsonb_object_agg(
                    'set_' || ws.set_number,
                    jsonb_build_object(
                        'weight', round(ws.weight::numeric, 2),
                        'repetitions', ws.repetitions::int,
                        'extra', COALESCE(
                            (
                                SELECT jsonb_agg(
                                    jsonb_build_object(
                                        'weight', round(ws_add.weight::numeric, 2),
                                        'repetitions', ws_add.repetitions::int
                                    )
                                )
                                FROM workout_set ws_add
                                JOIN workout w_add ON ws_add.workout_id = w_add.id
                                WHERE w_add.addition_id = w.id 
                                  AND ws_add.set_number = ws.set_number
                            ), '[]'::jsonb
                        )
                    )
                ) 
                FROM workout_set ws
                WHERE ws.workout_id = w.id
            )
        )
    ) AS workouts
FROM workout w
JOIN muscle_group mg ON w.muscle_group_id = mg.id
JOIN exercise_type et ON w.exercise_type_id = et.id
GROUP BY w.workout_number;

    `;

        const {rows} = await pool.query(query);

        if (rows.length > 0) {
            res.json({entries: rows});
        } else {
            res.json({message: 'Нет данных о тренировках'});
        }
    } catch (error) {
        console.error('Ошибка при получении данных о подходах:', error);
        res.status(500).send(error.message);
    }
}

// Получение уникальных типов упражнений
async function getExerciseTypes(req, res) {
    try {
        const query = 'SELECT DISTINCT name FROM public.exercise_type';
        const {rows} = await pool.query(query);
        res.json(rows.length > 0 ? rows : {message: 'Нет уникальных типов упражнений'});
    } catch (error) {
        console.error('Ошибка при получении типов упражнений:', error);
        res.status(500).send(error.message);
    }
}

// Получение уникальных групп мышц
async function getMuscleGroups(req, res) {
    try {
        const query = 'SELECT DISTINCT name FROM public.muscle_group';
        const {rows} = await pool.query(query);
        res.json(rows.length > 0 ? rows : {message: 'Нет уникальных групп мышц'});
    } catch (error) {
        console.error('Ошибка при получении групп мышц:', error);
        res.status(500).send(error.message);
    }
}

// Добавление тренировки и подходов
async function addWorkout(req, res) {
    const {workout_number, muscle_group_id, exercise_type_id, title, addition_id, sets} = req.body;
    try {
        // Вставляем тренировку
        const workoutQuery = `
      INSERT INTO public.workout(
        workout_number,
        muscle_group_id,
        exercise_type_id,
        title,
        addition_id
      ) RETURNING id;
    `;
        const {rows} = await pool.query(workoutQuery, [workout_number, muscle_group_id, exercise_type_id, title, addition_id]);
        const workout_id = rows[0].id;

        // Вставляем подходы для тренировки
        const setQuery = `
      INSERT INTO public.workout_set(workout_id, set_number, weight, repetitions)
      VALUES ($1, $2, $3, $4)
    `;

        // Перебираем каждый подход и добавляем его
        for (const set of sets) {
            await pool.query(setQuery, [
                workout_id,
                set.set_number,
                set.weight,
                set.repetitions
            ]);
        }

        res.status(201).json({message: 'Тренировка и подходы успешно добавлены'});
    } catch (error) {
        console.error('Ошибка при добавлении тренировки:', error);
        res.status(500).send(error.message);
    }
}

module.exports = {
    addWorkoutWithSets,
    addWorkout,
    getMuscleGroups,
    getExerciseTypes,
    getWorkoutSets
}
