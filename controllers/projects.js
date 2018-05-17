const Project = require('../models/project');
const File    = require('../models/file');
const User    = require('../models/user');

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
            var project = new Project(res[0].data);

            File.query()
            .where('project_id', '=', project.data.id)
            .group_by(['id', 'father_id'])
            .order_by('father_id')
            .then(function(res) {
                project.file_tree = {};

                // TODO: make json file tree

                response.send(project);
            })
            .catch(function(err) {
                response.send(err)
            });

            // TODO: Return project file tree
            // TODO: Return project users

        })
        .catch(function(err) {
            response.send(err);
        });
    }

    static store(request, response)
    {
        var project  = new Project(request.body);

        project.save()
        .then(function(res) {
            var root_dir = new File({
               name: '/',
               type: 'd',
               project_id: res.insertId,
               created_by: 1, // TODO: where to get logged in user id?
            });

            root_dir.save()
            .then(function(res) {
                response.send({
                    message: 'Project created',
                    project: project,
                });
            })
            .catch(function(err) {
                response.send(err);
            });

            // TODO: how to get loged in user?
            // TODO: create relationship between project and user

            // u.save_related(p, 'user_id', 'project_id', 'project_user', {role_id: 5}).then(function(res) {
            //     response.send({
            //         message: 'Project created',
            //         project: project,
            //     });
            // });

        })
        .catch(function(err) {
            response.send(err);
        });

    }

    static update(request, response)
    {
        Project.find(request.params.id)
        .then(function(res) {
            var project = new Project(res[0].data);

            Object.keys(request.body).forEach(function(key) {
                project.data[key] = request.body[key];
            });

            project.save()
            .then(function(res) {
                response.send({
                    message: "Project updated",
                    project: project
                });
            })
            .catch(function(err) {
                response.send(err);
            });

        })
        .catch(function (err) {
            response.send(err);
        });
    }

    static destroy(request, response)
    {
        response.send(`Delete project with id ${request.params.id}`);
    }

    static file_tree(request, response)
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

    static add_user(request, response)
    {
        Project.find(request.params.id)
        .then(function(res) {
            var project = new Project(res[0].data);
            var user    = new User({id: request.body.user_id});

            project.save_related(user, 'project_id', 'user_id', 'project_user', {role_id: 5})
            .then(function(res) {
                response.send({
                    message: "User added to project",
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
}

module.exports = ProjectsController;
