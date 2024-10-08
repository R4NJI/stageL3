const { Pool } = require('pg');

// Créer un pool de connexions à la base de données PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'modulestat',
    password: 'njaranji',
    port: 5432,
});

// Exporter le pool pour l'utiliser ailleurs
module.exports = pool;
