const User = require('../models/user');

class AuthController
{
    static register(request, response)
    {
        response.send("register");
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
