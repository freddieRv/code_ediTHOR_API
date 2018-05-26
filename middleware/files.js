const formidable = require('formidable');
const Project    = require('../models/project');

module.exports = {
    create_file_request(request, response, next)
    {
        var form = new formidable.IncomingForm();

        form.parse(request, function(error, fields, files) {
            var errors = [];

            if (!fields.name) {
                errors.push('name field is required');
            }

            if (!fields.father_id) {
                errors.push('father_id field is required');
            }

            if (!files.file) {
                errors.push('no file uploaded');
            }

            if (errors.length) {
                response.status(400).send({
                    errors: errors,
                });
            } else {
                next();
            }
        });
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

    }
}
