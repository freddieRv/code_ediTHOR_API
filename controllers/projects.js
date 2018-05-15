const Project = require('../models/project');

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
        var project = new Project(request.body);

        // TODO: create project root dir
        // TODO: create relationship between project and user

        response.send({
            message: 'Project created',
            project: project,
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
