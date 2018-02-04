
const express = require('express');

const app = express.Router();


const init = connection => {

    app.use((req, res, next) => {
        if(!req.session.user) {
            res.redirect('/')
        } else {
            next()
        }
    })

    app.get('/', async(req, res) => {

        const [groups, fields] = await connection.execute('select groups.*, groups_users.role from groups left join groups_users on groups.id = groups_users.groups and groups_users.users = ?', [
            req.session.user.id
        ])

        res.render('groups', {
			groups
		});

    })

    app.get('/:id/join', async(req, res) => {

        const [ rows, fields ] = await connection.execute('select * from groups_users where users = ? and groups = ?', [
			req.session.user.id,
			req.params.id
		]); // User session and user id

        if(rows.length > 0) {

            res.redirect('/groups')

        } else {

            await connection.execute('insert into groups_users (groups, users, role) values (?,?,?)', [
                req.params.id,
                req.session.user.id,
                'pending'
            ]) // Group id, user id and role

            res.redirect('/groups')

        }

    })

    app.get('/:id', async(req, res) => {

        const [ group ]  = await connection.execute('select groups.*, groups_users.role from groups left join groups_users on groups_users.groups = groups.id and groups_users.users = ? where groups.id = ?', [
			req.session.user.id,
			req.params.id
		]);

        const [pendings] = await connection.execute('select groups_users.*, users.name from groups_users inner join users on groups_users.users = users.id and groups_users.role like "pending" and groups_users.groups = ?', [
			req.params.id
		]);

        const [games] = await connection.execute(`

            select
                games.*,
                guessings.result_a as guess_a,
                guessings.result_b as guess_b,
                guessings.score

            from
                games
            left join guessings on games.id = guessings.game_id and guessings.users_id = ? and guessings.group_id = ?

            `, [
            req.session.user.id,
            req.params.id
		]);

        res.render('group', {
            pendings,
            group: group[0],
            games
        })

    })

    // Relation id and user id

    app.get('/:id/pending/:idgu/:op', async(req, res) => { // Approve or not a user in a group

        const [ group ]  = await connection.execute('select groups.*, groups_users.role from groups left join groups_users on groups_users.groups = groups.id and groups_users.users = ? where groups.id = ?', [
			req.session.user.id,
			req.params.id
		]);

        if(group.length === 0 || group[0].role === 'owner') {

			if(req.params.op === 'yes'){

				await connection.execute('update groups_users set role = "user" where id = ? limit 1', [
					req.params.idgu
				]);

				res.redirect('/groups/' + req.params.id);

			} else {

				await connection.execute('delete from groups_users WHERE id = ? limit 1', [
					req.params.idgu
				]);

				res.redirect('/groups/' + req.params.id);

			};
		};

    })

    app.post('/:id', async(req, res) => {

        const guessings = [];

        Object.keys(req.body).forEach(team => {

				const parts = team.split('_');

				const game  = {
					game_id: parts[1],
					result_a: req.body[team].a,
					result_b: req.body[team].b
				};

				guessings.push(game);

		});

		const batch = guessings.map(guess => {

			return connection.execute('insert into guessings (result_a, result_b, game_id, group_id, users_id) values (?,?,?,?,?)', [
				guess.result_a,
				guess.result_b,
				guess.game_id,
				req.params.id,
				req.session.user.id
			]);

		});

		await Promise.all(batch);

		res.redirect('/groups/' + req.params.id);

	});

    app.post('/', async(req, res) => {

        const [insertedid, insertedfl] = await connection.execute('insert into groups (name) values (?)', [
            req.body.name
        ])

        await connection.execute('insert into groups_users (groups, users, role) values (?,?,?)', [
            insertedid.insertId,
            req.session.user.id,
            'owner'
        ])

        res.redirect('/groups')

    })

    return app

}

module.exports = init
