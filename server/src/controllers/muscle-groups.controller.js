const {Pool} = require('pg')
const {getNetworkDetails} = require('../db_type')
const config = require('../config')


const networkDetails = getNetworkDetails()
const dbConfig = networkDetails.databaseType === 'build' ? config.dbConfig : config.dbConfigTest

// Создание пула соединений с базой данных
const pool = new Pool(dbConfig)

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

module.exports = {
    getMuscleGroups,
}
