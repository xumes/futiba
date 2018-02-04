
const express = require('express')

const app = express.Router()


const init = connection => {

    app.get('/',(req,res) => {
        res.render('home')
    })

    app.get('/login', (req, res) => {
        res.render('login', {error: false})
    })

    app.post('/login', async(req, res) => {

        const [rows, fields] = await connection.execute('select * from users where email = ?', [req.body.email])

        if (rows.length === 0) {
            res.render('login', {error: 'Usuário e / ou senha inválidos !'})
        } else {
            if (rows[0].passwd === req.body.passwd) {

                const userdb = rows[0]

                const user = {
                    id: userdb.id,
                    name: userdb.name,
                    role: userdb.role
                }

                req.session.user = user

                res.redirect('/') // Logged

            } else {
                res.render('login', {error: 'Usuário e / ou senha inválidos !'})
            }
        }

    })

    app.get('/logout', (req, res) => {
        req.session.destroy( err => {
            res.redirect('/')
        })
    })

    app.get('/new-account', (req, res) => {
        res.render('new-account', { error: false })
    })

    app.post('/new-account', async (req, res) => {

        const [rows, fields] = await connection.execute('select * from users where email = ?', [req.body.email]) // Prepered Statment

        if (rows.length === 0) { // Insert

            const { name, email, passwd } = req.body

            const [inserted, insertedfields] = await connection.execute('insert into users (name, email, passwd, role) values (?,?,?,?)', [name, email, passwd, 'user'])

            const user = {
                id: inserted.insertId,
                name: name,
                role: 'user'
            }

            req.session.user = user

            res.redirect('/')

        } else {
            res.render('new-account', {
                error: 'This account already exist'
            })
        }

    })

    return app

}

module.exports = init
