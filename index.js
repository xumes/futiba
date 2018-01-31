
const express = require('express')

const app = express()

const mysql = require('mysql2/promise')


const account = require('./account')


app.use(express.static('public'))


app.set('view engine', 'ejs')


const init = async() => {

    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'Futiba'
    })

    app.use(account(connection))

    app.listen(3000, err => {
        console.log('\n\033[31m➜\033[37m Server \033[32mOnline\033[37m\n')
    })

}

init()
