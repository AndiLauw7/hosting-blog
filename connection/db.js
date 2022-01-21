const { Pool } = require('pg')
const dbpool = new Pool({
    host: 'ec2-3-222-49-168.compute-1.amazonaws.com',
    database: 'df1jkrk0941njo',
    port: '5432',
    user: 'rkeayolfrekrda',
    password: '0610ed19423614997a5625be8ab3b48d78516404070353e12bc69e5c241bd8ee',
    url: 'postgres://rkeayolfrekrda:0610ed19423614997a5625be8ab3b48d78516404070353e12bc69e5c241bd8ee@ec2-3-222-49-168.compute-1.amazonaws.com:5432/df1jkrk0941njo',
    heroku_cli: 'heroku pg:psql postgresql-curly-92964 --app lauwsblogid'
})
module.exports = dbpool