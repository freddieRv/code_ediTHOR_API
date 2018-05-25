const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env    = require('../env');
const User   = require('../models/user');

class AuthController
{
    static register(request, response)
    {
        var user = new User({
            username: request.body.username,
            email:    request.body.email,
            password: bcrypt.hashSync(request.body.password, 8)
        });

        user.save()
        .then(function(res) {
            var token = jwt.sign(
                {
                    id: res.insertId
                },
                env.app_key,
                {
                    expiresIn: env.auth_token_expiration_time
                }
            );

            response.send({
                message: 'User registered',
                user: user,
                token: token
            });

        })
        .catch(function(err) {
            response.status(500).send(err);
        });
    }

    static login(request, response)
    {
        User.query()
        .where('username', '=', request.body.username)
        .orWhere('email', '=', request.body.username)
        .exec()
        .then(function(res) {

            if (!res.length) {
                response.status(400).send({
                    message: 'This credentials don\'t match our records'
                });
                return;
            }

            var valid_password = bcrypt.compareSync(request.body.password, res[0].password);

            if (valid_password) {
                var token = jwt.sign(
                    {
                        id: res[0].id
                    },
                    env.app_key,
                    {
                        expiresIn: env.auth_token_expiration_time
                    }
                );

                response.send({
                    message: 'Login succesfull',
                    token: token
                });
            } else {
                response.status(400).send({
                    message: 'This credentials don\'t match our records'
                });
            }
        })
        .catch(function(err) {
            response.status(500).send(err);
        });
    }

    static forgot_password_email(request, response)
    {
        response.send("forgot password");
    }

    static password_reset(request, response)
    {
        response.send("password reset");
    }

}

module.exports = AuthController;
