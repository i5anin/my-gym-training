const {Pool} = require('pg')
const {getNetworkDetails} = require('../db_type')
const config = require('../config')


const networkDetails = getNetworkDetails()
const dbConfig = networkDetails.databaseType === 'build' ? config.dbConfig : config.dbConfigTest

// Создание пула соединений с базой данных
const pool = new Pool(dbConfig)

async function getExercises(req, res) {
    try {
        const query = `
            SELECT id, title, symbol 
            FROM public.exercise 
            ORDER BY title ASC;
        `;
        const { rows } = await pool.query(query);
        res.json(rows.length > 0 ? rows : { message: 'Нет доступных упражнений' });
    } catch (error) {
        console.error('Ошибка при получении списка упражнений:', error);
        res.status(500).send(error.message);
    }
}




module.exports = {

    getExercises,

}
