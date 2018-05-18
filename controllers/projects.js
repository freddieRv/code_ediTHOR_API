const Project = require('../models/project');
const File    = require('../models/file');
const User    = require('../models/user');

class ProjectsController
{
    static index(request, response)
    {
        User.find(request.authenticated_user_id)
        .then(function(users) {
            var user = new User(users[0].data);

            user.projects()
            .then(function(projects) {
                response.send(projects);
            })
            .catch(function(err) {
                response.status(500).send(err);
            });
        })
        .catch(function(err) {
            response.status(500).send(err);
        });
    }

    static show(request, response)
    {
        Project.find(request.params.id)
        .then(function(project_res) {
            var project = new Project(project_res[0].data);

            File.query()
            .where('project_id', '=', project.data.id)
            .group_by(['id', 'father_id'])
            .order_by('father_id')
            .exec()
            .then(function(file_res) {

                console.log(project_res);

                project.file_tree = {};

                // TODO: make json file tree

                response.send(project);
            })
            .catch(function(err) {
                response.send(err)
            });

        })
        .catch(function(err) {
            response.send(err);
        });
    }

    static store(request, response)
    {
        var project  = new Project(request.body);

        project.save()
        .then(function(project_res) {
            var root_dir = new File({
               name: '/',
               type: 'd',
               project_id: project_res.insertId,
               created_by: request.authenticated_user_id,
            });

            project.data.id = project_res.insertId;

            root_dir.save()
            .then(function(dir_res) {

                User.find(request.authenticated_user_id)
                .then(function(users) {
                    var user = new User(users[0].data)

                    user.save_related(project, 'user_id', 'project_id', 'project_user', {role_id: 3})
                    .then(function(user_res) {

                        response.send({
                            message: 'Project created',
                            project: project,
                        });
                    })
                    .catch(function(err) {
                        response.status(500).send(err);
                    });

                })
                .catch(function(err) {
                    response.status(500).send(err);
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
