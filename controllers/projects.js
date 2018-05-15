const Project   = require('../models/project');
const Directory = require('../models/directory');

class ProjectsController
{
    static index(request, response)
    {
        Project.all()
        .then(function(res) {
            response.send(res);
        })
        .catch(function(err) {
            response.send(err);
        });
    }

    static show(request, response)
    {
        Project.find(request.params.id)
        .then(function(res) {
            response.send(res);
        })
        .catch(function(err) {
            response.send(err);
        });
    }

    static store(request, response)
    {
        var project  = new Project(request.body);
        var root_dir = new Directory();

        root_dir.save()
        .then(function(res) {
            project.data.root_dir_id = res.id;

            project.save()
            .then(function(res) {

                // TODO: create relationship between project and user

                // TODO: how to save related models?

                // TODO: how to get loged in user?

                response.send({
                    message: 'Project created',
                    project: project,
                });
            })
            .catch(function(err) {
                response.send(err);
            });
        })
        .catch(function(err) {
            response.send(err);
        });

    }

    static update(request, response)
    {
        response.send(`Edit project with id ${request.params.id}`);
    }

    static destroy(request, response)
    {
        response.send(`Delete project with id ${request.params.id}`);
    }

    static files(request, response)
    {
        Project.find(request.params.id)
        .then(function(res) {
            if (res) {
                p = new Project(res);

                p.files()
                .then(function(res) {
                    response.send(res);
                })
                .catch(function(err) {
                    respponse.send(err);
                });
            } else {
                response.send({});
            }
        })
        .catch(function(err) {
            response.send(err);
        });
    }
}

module.exports = ProjectsController;
