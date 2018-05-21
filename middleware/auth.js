const jwt  = require('jsonwebtoken');
const env  = require('../env');
const User = require('../models/user');

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

        console.log(request.headers);

        if (!token) {
            response.status(401).send("No auth token provided");
            next('router');
        } else {
            jwt.verify(token, env.app_key, function(err, decoded) {
                if (err) {
                    response.status(500).send('Failed to authenticate token');
                } else {
                    request.authenticated_user_id = decoded.id;
                    next();
                }
            });
        }

    }

};
