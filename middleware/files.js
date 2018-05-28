const Project = require('../models/project');
const User    = require('../models/user');

module.exports = {
    create_file_request(request, response, next)
    {
        var errors = [];

        if (!request.body['name']) {
            errors.push('name field is required');
        }

        if (!request.body['father_id']) {
            errors.push('father_id field is required');
        }

        if (!request.body['file']) {
            errors.push('no file uploaded');
        }

        if (errors.length) {
            response.status(400).send({
                errors: errors,
            });
        } else {
            next();
        }
    },

    create_dir_request(request, response, next)
    {
        var errors = [];

        if (!request.body['name']) {
            errors.push('name field is required');
        }

        if (!request.body['father_id']) {
            errors.push('father_id field is required');
        }

        if (errors.length) {
            response.status(400).send({
                errors: errors,
            });
        } else {
            next();
        }
    },

    father_belongs_to_project(request, response, next)
    {
        var project = new Project({
            id: request.params.id,
        });

        project.raw_files()
        .then(function(files) {

            var error  = "Father not found";
            var status = 404;
            var valid  = false;

            for (var i = 0; i < files.length; i++) {
                if (files[i].id == request.body.father_id) {
                    if (files[i].type == "d") {
                        valid = true;
                        break;
                    } else {
                        status = 400;
                        error  = "Father is not a directory";
                    }
                }
            }

            if (!valid) {
                response.status(status).send(error);
                next('router');
            } else {
                next();
            }

        })
        .catch(function(files_err) {
            response.status(500).send(files_err);
        });

    },

    can_show(request, response, next)
    {

        User.find(request.authenticated_user_id)
        .then(function(users) {
            var user = new User(users[0].data);

            user.files()
            .then(function(files) {
                var allowed = false;

                for (var i = 0; i < files.length; i++) {
                    if (files[i].id == request.params.id) {
                        allowed = true;
                        break;
                    }
                }

                if (!allowed) {
                    response.status(401).send({
                        message: "You don't have permission to open this file"
                    });
                    
                    next("router");
                    return;
                }

                next();
            })
            .catch(function(files_err) {
                response.status(500).send(files_err);
            });

        })
        .catch(function(user_err) {
            response.status(500).send(user_err);
        });
    }

}
