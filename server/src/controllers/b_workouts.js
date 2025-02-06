const { Pool } = require('pg');
const { getNetworkDetails } = require('../db_type');
const config = require('../config');

const pool = new Pool(getNetworkDetails().databaseType === 'build' ? config.dbConfig : config.dbConfigTest);

// Универсальная функция для выполнения запросов
const queryDatabase = async (query, params = []) => {
    try {
        const { rows } = await pool.query(query, params);
        return rows;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Получение уникальных значений из таблицы
const getUniqueValues = async (tableName, columnName) => {
    const query = `SELECT DISTINCT ${columnName} FROM public.${tableName}`;
    const rows = await queryDatabase(query);
    return rows.length ? rows : { message: `Нет уникальных данных для ${tableName}` };
};

// Запрос на получение всех тренировок с подходами
const getWorkoutSets = async (req, res) => {
    try {
        const query = `
            SELECT 
                w.id AS workout_id,
                w.workout_number,
                mg.name AS muscle_group,
                et.name AS exercise_type,
                w.title,
                w.addition_id,
                jsonb_object_agg(
                    'set_' || ws.set_number,
                    jsonb_build_object(
                        'weight', round(ws.weight::numeric, 2),
                        'repetitions', ws.repetitions::int,
                        'extra', COALESCE((
                            SELECT jsonb_agg(
                                jsonb_build_object(
                                    'weight', round(ws_add.weight::numeric, 2),
                                    'repetitions', ws_add.repetitions::int
                                )
                            )
                            FROM workout_set ws_add
                            JOIN workout w_add ON ws_add.workout_id = w_add.id
                            WHERE w_add.addition_id = w.id AND ws_add.set_number = ws.set_number
                        ), '[]'::jsonb)
                    )
                ) AS sets
            FROM workout_set ws
            JOIN workout w ON ws.workout_id = w.id
            JOIN muscle_group mg ON w.muscle_group_id = mg.id
            JOIN exercise_type et ON w.exercise_type_id = et.id
            GROUP BY w.id, w.workout_number, mg.name, et.name, w.title, w.addition_id;
        `;
        const rows = await queryDatabase(query);
        res.json(rows.length > 0 ? { entries: rows } : { message: 'Нет данных о тренировках' });
    } catch (error) {
        console.error('Ошибка при получении данных о подходах:', error);
        res.status(500).send(error.message);
    }
};

// Получение уникальных типов упражнений
const getExerciseTypes = async (req, res) => {
    const rows = await getUniqueValues('exercise_type', 'name');
    res.json(rows);
};

// Получение уникальных групп мышц
const getMuscleGroups = async (req, res) => {
    const rows = await getUniqueValues('muscle_group', 'name');
    res.json(rows);
};

// Добавление тренировки и подходов
const addWorkout = async (req, res) => {
    const { workout_number, muscle_group_id, exercise_type_id, title, addition_id, sets } = req.body;
    const query = `
        INSERT INTO public.workout(
            workout_number, muscle_group_id, exercise_type_id, title, addition_id
        ) RETURNING id;
    `;
    try {
        const { rows } = await queryDatabase(query, [workout_number, muscle_group_id, exercise_type_id, title, addition_id]);
        const workout_id = rows[0].id;

        const setQuery = `
            INSERT INTO public.workout_set(workout_id, set_number, weight, repetitions)
            VALUES ($1, $2, $3, $4)
        `;
        for (const set of sets) {
            await queryDatabase(setQuery, [workout_id, set.set_number, set.weight, set.repetitions]);
        }

        res.status(201).json({ message: 'Тренировка и подходы успешно добавлены' });
    } catch (error) {
        console.error('Ошибка при добавлении тренировки:', error);
        res.status(500).send(error.message);
    }
};

module.exports = {
    addWorkout,
    getMuscleGroups,
    getExerciseTypes,
    getWorkoutSets
};
