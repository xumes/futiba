
const express = require('express')

const app = express.Router()


const init = connection => {

    app.use((req, res, next) => {
        if(!req.session.user) {
            res.redirect('/')
        } else {
            next()
        }
    })
    
    app.get('/classification', async(req, res) => {

        const [rows, fields] = await connection.execute(`
            select users.id, users.name, sum(guessings.score) as score from users left join guessings on guessings.users_id = users.id group by users.id order by score DESC;
        `)

        res.render('classification', {
            top: rows
        })

    })

    return app

}

module.exports = init
