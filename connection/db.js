const { Pool } = require('pg')
const dbpool = new Pool({
    database: 'postgres',
    port: '5432',
    user: 'postgres',
    password: '769800'
})
module.exports = dbpool