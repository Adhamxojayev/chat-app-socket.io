const {pgConfig} = require('../config.js')
const {Pool} = require('pg')

const pool = new Pool(pgConfig)

async function fetch (query, array) {
    const client = await pool.connect()
    try {
        
        const {rows} = await client.query(query, array != undefined ? array : null)
        return rows
    } catch (error) {

        console.log(error);

    }finally{
        await client.release()
    }
}

module.exports = {
    fetch
}