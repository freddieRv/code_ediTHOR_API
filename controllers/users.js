const User    = require('../models/user');
const Project = require('../models/project');

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
        .then(function(users) {

            if (!users.length) {
                response.send({});
                return;
            }

            var user = new User(users[0].data);

            user.projects(Project)
            .then(function(projects) {
                response.send({
                    id:       user.data.id,
                    username: user.data.username,
                    email:    user.data.email,
                    active:   user.data.active,
                    projects: projects
                });
            })
            .catch(function(projects_err) {
                response.status(500).send(projects_err);
            });

        })
        .catch(function(users_err) {
            response.send(users_err);
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
