const Project   = require('../models/project');
const Directory = require('../models/directory');
const User      = require('../models/user');

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
            // var project = res;

            // Directory.find(project.data.root_dir_id)
            // .then(function(directory) {
            //     directory.tree();
            // })
            // .catch(function(err) {
            //     response.send(err);
            // });

            // TODO: Return project file tree too
            response.send(res);
        })
        .catch(function(err) {
            response.send(err);
        });
    }

    static store(request, response)
    {
        var project  = new Project(request.body);
        var root_dir = new Directory({name: '/'});

        root_dir.save()
        .then(function(res) {
            project.data.root_dir_id = res.insertId;

            project.save()
            .then(function(res) {

                // TODO: how to get loged in user?
                // TODO: create relationship between project and user

                // u.save_related(p, 'user_id', 'project_id', 'project_user', {role_id: 5}).then(function(res) {
                //     response.send({
                //         message: 'Project created',
                //         project: project,
                //     });
                // });

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
