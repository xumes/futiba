
const express = require('express')

const session = require('express-session')

const app = express()

const mysql = require('mysql2/promise')

const body = require('body-parser')


const account = require('./account')

const admin = require('./admin')


// Middleware :

app.use(express.static('public'))

app.use(body.urlencoded({extended: true}))

app.use(session({
    secret: 'full-stack',
    resave: true,
    saveUninitialized: true
}))

app.set('view engine', 'ejs')


const init = async() => {

    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'Futiba'
    })

    app.use((req, res, next) => { // If it's not logged the system stop

        if(req.session.user){
            res.locals.user = req.session.user // Home.ejs -> Entrar != User NAme
        } else {
            res.locals.user = false
        }

        next()

    })

    app.use('/admin', admin(connection))

    app.use(account(connection))

    app.listen(3000, err => {
        if (err)
            console.log('\n\033[31m➜\033[37m [ Server ] \033[31mError\033[37m\n')
        else
            console.log('\n\033[31m➜\033[37m [ Server ] \033[32mOnline\033[37m\n')
    })

}

init()
