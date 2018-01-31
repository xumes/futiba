
const express = require('express')

const app = express.Router()


const init = connection => {

    app.get('/',(req,res) => {
        res.render('home')
    })

    app.get('/new-account', (req, res) => {
        res.render('new-account')
    })

    return app

}

module.exports = init
