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
                response.status(404).send({
                    message: "User not found"
                });

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
        User.find(request.params.id)
        .then(function(users) {

            var user = new User(users[0].data);

            if (request.body['username']) {
                user.data.username = request.body.username;
            }

            if (request.body['email']) {
                user.data.email = request.body.email;
            }

            if (request.body['password'] && request.body['password_confirmation']) {
                if (request.body.password == request.body.password_confirmation) {
                    user.data.password = bcrypt.hashSync(request.body.password, 8);
                }
            }

            user.save()
            .then(function(save_res) {
                response.send({
                    message: "User updated",
                    project: user
                });
            })
            .catch(function(save_err) {
                response.send(err);
            });

        })
        .catch(function(err) {
            response.send(err);
        });
    }

    static destroy(request, response)
    {
        User.query()
        .where('id', '=', request.params.id)
        .destroy()
        .then(function(res) {
            response.send({
                message: "user deleted"
            });
        })
        .catch(function(err) {
            response.status(500).send(err);
        });
    }
}

module.exports = UsersController;
