
const express = require('express')

const app = express.Router()


const init = connection => {

    app.use((req, res, next) => {
        if(!req.session.user || req.session.user.role === 'user') {
            res.redirect('/')
        } else {
            next()
        }
    })

    app.get('/', (req, res) => {
        res.send('admins')
    })

    app.get('/games', async(req,res) => {

        const [rows,fields] = await connection.execute('select * from games')

        res.render('admin/games',{
            games: rows
        })

    })

    app.get('/games/delete/:id', async (req, res) => {

        await connection.execute('delete from games where id = ? limit 1', [req.params.id])

        res.redirect('/admin/games')

    })

    app.post('/games', async (req, res) => {

        const {team_a, team_b} = req.body

        await connection.execute('insert into games (team_a, team_b) values (?,?)', [team_a, team_b])

        res.redirect('/admin/games')

    })

    app.post('/games/results', async(req, res) => {

        let games = []

        Object.keys(req.body).forEach(team => {

				let parts = team.split('_')

				let game  = {
					game_id: parseInt(parts[1]),
					result_a: parseInt(req.body[team].a),
					result_b: parseInt(req.body[team].b)
				}

				games.push(game)

		})

        for(let count = 0; count < games.length; count++){

            let game = games[count]

            let [guessings] = await connection.execute('select * from guessings where game_id = ?', [
                game.game_id
            ])

            let batch = guessings.map(guess => {

                let score = 0

                if(guess.result_a === game.result_a && guess.result_b === game.result_b) {

                    score = 100

                } else {

                    if(guess.result_a === game.result_a || guess.result_b === game.result_b) {

                        score += 25

                        if(guess.result_a < guess.result_b && game.result_a < game.result_b) {
                            score += 25
                        }

                        if(guess.result_a > guess.result_b && game.result_a > game.result_b){
                            score += 25
                        }

                    }

                }

                return connection.execute('update guessings set score = ? where id = ?', [
                    score,
                    guess.id
                ])

            })

            await Promise.all(batch)

        }

        res.redirect('/admin/games')

    })

    return app

}

module.exports = init
