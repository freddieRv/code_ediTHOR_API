const User = require('../models/user');

class UsersController
{
    static index(request, response)
    {
        User.all()
        .then(function(res) {
            response.send(res);
        })
        .catch(function(err) {
            response.send(err);
        });
    }

    static show(request, response)
    {
        User.find(request.params.id)
        .then(function(res) {

            // TODO: get projects

            response.send(res);
        })
        .catch(function(err) {
            response.send(err);
        });
    }

    static update(request, response)
    {
        response.send(`Edit user with id ${request.params.id}`);
    }

    static destroy(request, response)
    {
        response.send(`Delete user with id ${request.params.id}`);
    }
}

module.exports = UsersController;
