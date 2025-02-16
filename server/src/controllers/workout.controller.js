const { Pool } = require('pg')
const { getNetworkDetails } = require('../db_type')
const config = require('../config')

const networkDetails = getNetworkDetails()
const dbConfig = networkDetails.databaseType === 'build' ? config.dbConfig : config.dbConfigTest

const pool = new Pool(dbConfig)

/**
 * Получение списка уникальных названий тренировок.
 */
async function getUniqueWorkoutTitles(req, res) {
    try {
        const query = 'SELECT DISTINCT id, title FROM public.workout ORDER BY title ASC';
        const { rows } = await pool.query(query);
        res.json(rows.length > 0 ? rows : { message: 'Нет уникальных названий тренировок' });
    } catch (error) {
        console.error('Ошибка при получении названий тренировок:', error);
        res.status(500).send(error.message);
    }
}

module.exports = {
    getUniqueWorkoutTitles,
}
