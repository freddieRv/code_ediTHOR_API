const User    = require('../models/user');
const Project = require('../models/project');

function get_project_users(project_id, success, fail)
{
    Project.find(project_id)
    .then(function(projects) {

        if (projects == false) {
            fail('Project not found');
            return;
        }

        var project = new Project(projects[0].data);

        project.users(User)
        .then(function(users) {
            success(users);
        })
        .catch(function(users_err) {
            fail(users_err);
        });

    })
    .catch(function(projects_err) {
        fail(projects_err);
    });
}

module.exports = {
    create_request(request, response, next)
    {
        errors = [];

        if (!request.body['name']) {
            errors.push('name field is required');
        }

        if (!request.body['description']) {
            errors.push('description field is required');
        }

        if (errors.length) {
            response.status(400).send({
                erros: errors,
            });
        } else {
            next();
        }

    },

    add_user(request, response, next)
    {
        get_project_users(request.params.id, function(users) {
            var allowed = false;
            var message = "You dont have permission to update this project";

            users.forEach(function(user) {
                if (user.id == request.authenticated_user_id) {
                    if (user.role == 'project_admin') {
                        allowed = true;
                    } else {
                        message = "You dont have permission to delete this project";
                    }
                }
            });

            if (allowed) {
                var errors = [];

                if (!request.body['user_id']) {
                    errors.push('user_id field is required');
                }

                if (errors.length) {
                    response.status(400).send({
                        errors: errors,
                    });
                } else {
                    next();
                }

            } else {
                response.status(301).send(message);
                next('router');
            }

        }, function(err) {
            response.status(500).send(err);
            next('router');
        });
    },

    can_update(request, response, next)
    {
        get_project_users(request.params.id, function(users) {
            var allowed = false;

            users.forEach(function(user) {
                if (user.id == request.authenticated_user_id) {
                    allowed = true;
                }
            });

            if (allowed) {
                next();
            } else {
                response.status(301).send("You dont have permission to update this project");
                next('router');
            }

        }, function(err) {
            response.status(500).send(err);
            next('router');
        });
    },

    can_delete(request, response, next)
    {
        get_project_users(request.params.id, function(users) {
            var allowed = false;
            var message = "You dont have permission to update this project";

            users.forEach(function(user) {
                if (user.id == request.authenticated_user_id) {
                    if (user.role == 'project_admin') {
                        allowed = true;
                    } else {
                        message = "You dont have permission to delete this project";
                    }
                }
            });

            if (allowed) {
                next();
            } else {
                response.status(301).send(message);
                next('router');
            }

        }, function(err) {
            response.status(500).send(err);
            next('router');
        });
    }
}
