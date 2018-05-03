const User = require('../models/user.js')

class UsersController
{
    static index(request, response)
    {
        response.send("Yay!")
    }

    static show(request, response)
    {
        response.send(`Show user with id ${request.params.id}`);
    }

    static store(request, response)
    {
        response.send('Users store');
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
