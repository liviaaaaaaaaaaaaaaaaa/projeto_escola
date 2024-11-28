require('dotenv').config()
const {Pool} = require('pg')

const BD = new Pool({
 connectionString: process.env.DATABASE_URL
    //user: 'postgres', //nome usuario de banco de dados
    //host: 'localhost', //endereço do servidor
    //database: 'escola', //nome dobancode dados
    //password: 'admin', //Senha do banco de dados
    //port: 5432, //porta de conexão servidor 
})

module.exports = BD 