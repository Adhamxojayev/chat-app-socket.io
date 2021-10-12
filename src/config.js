const path = require('path')
require('dotenv').config({path: path.join(process.cwd(), 'src', '.env')})

const PORT = process.env.PORT ?? 5000

const pgConfig = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
}

module.exports ={
    pgConfig,
    PORT
}