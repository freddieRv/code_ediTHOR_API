const jwt  = require('jsonwebtoken');
const env  = require('../env');
const User = require('../models/user');
const Role = require('../models/role');

module.exports = {

    register_request(request, response, next)
    {
        errors = [];

        if (!request.body['username']) {
            errors.push('username field is required');
        }

        if (!request.body['email']) {
            errors.push('email field is required');
        }

        if (!request.body['password'] || !request.body['password_confirmation']) {
            errors.push('both password and password_confirmation fields are required');
        } else {
            if (!(request.body.password == request.body.password_confirmation)) {
                errors.push('password and password_confirmation do not match');
            }
        }

        if (errors.length) {
            response.status(400).send({
                errors: errors,
            });
        } else {
            next();
        }
    },

    login_request(request, response, next)
    {
        errors = [];

        if (!request.body['username']) {
            errors.push('username field is required');
        }

        if (!request.body['password']) {
            errors.push('password field is required');
        }

        if (errors.length) {
            response.status(400).send({
                errors: errors,
            });
        } else {
            next();
        }
    },

    auth(request, response, next)
    {
        var token = request.headers['x-access-token'];

        if (!token) {
            response.status(401).send("No auth token provided");
            next('router');
        } else {
            jwt.verify(token, env.app_key, function(err, decoded) {
                if (err) {
                    response.status(500).send('Failed to authenticate token');
                } else {

                    User.find(decoded.id)
                    .then(function(users) {
                        if (!users.length) {
                            response.status(500).send('Failed to authenticate token');
                        } else {
                            if (!users[0].data.active) {
                                response.status(401).send({
                                    message: 'User is inactive',
                                });
                            } else {
                                request.authenticated_user_id = decoded.id;
                                next();
                            }
                        }
                    })
                    .catch(function(user_err) {
                        response.status(500).send('Failed to authenticate token');
                    });
                }
            });
        }

    },

    is_admin(request, response, next)
    {
        User.find(request.authenticated_user_id)
        .then(function(users) {

            if (!users.length) {
                response.status(401).send("Failed to authenticate user");
                next('router');
                return;
            }

            var user = new User(users[0].data);

            user.role(Role)
            .then(function(role) {

                if (role[0].name == "admin") {
                    next();
                } else {
                    response.status(401).send("You don't have permission to perform this action");
                    next('router');
                }

            })
            .catch(function(role_err) {
                response.status(500).send(role_err)
            });

        })
        .catch(function(users_err) {
            response.status(500).send(users_err)
        });
    }

};
