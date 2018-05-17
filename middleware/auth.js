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
                erros: errors,
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
        }

        jwt.verify(token, env.app_key, function(err, decoded) {
            if (err) {
                response.status(500).send('Failed to authenticate token');
            } else {
                request.authenticated_user_id = decoded.id
                next();
            }
        });
    }

};
