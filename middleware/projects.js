const User    = require('../models/user');
const Project = require('../models/project');

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
        errors = [];

        if (!request.body['user_id']) {
            errors.push('user_id field is required');
        }

        if (errors.length) {
            response.status(400).send({
                erros: errors,
            });
        } else {
            next();
        }
    },

    can_update(request, response, next)
    {
        console.log(request);

        Project.find(request.params.id)
        .then(function(projects) {
            var project = new Project(projects[0].data);

            project.users(User)
            .then(function(users) {
                var allowed = false;

                users.forEach(function(user) {
                    if (user.data.id == request.params.id) {
                        allowed = true;
                    }
                });

                if (allowed) {
                    next();
                } else {
                    response.status(301).send("You dont have permission to update this project");
                    next('router');
                }

            })
            .catch(function(users_err) {
                response.status(500).send(users_err);
                next('router');
            });

        })
        .catch(function(projects_err) {
            response.status(500).send(projects_err);
            next('router');
        });
    },

    can_delete()
    {
        
    }
}
