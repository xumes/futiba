
const express = require('express')

const session = require('express-session')

const mysql = require('mysql2/promise')

const body = require('body-parser')


const app = express()


const account = require('./account')

const admin = require('./admin')

const groups = require('./groups');


// Middlewares

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

    app.use((req, res, next) => { // Not logged the system stop

        if(req.session.user){
            res.locals.user = req.session.user
        } else {
            res.locals.user = false
        }

        next()

    })

    app.use('/admin', admin(connection))

    app.use(account(connection))

    app.use('/groups', groups(connection))

    app.listen(3000, err => {
        if (err)
            console.log('\n\033[31m➜\033[37m [ Server ] \033[31mError\033[37m\n')
        else
            console.log('\n\033[31m➜\033[37m [ Server ] \033[32mOnline\033[37m\n')
    })

}

init()
