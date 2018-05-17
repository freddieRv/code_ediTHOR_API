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
            response.send(err);
        });
    }

    static login(request, response)
    {
        response.send("login");
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
