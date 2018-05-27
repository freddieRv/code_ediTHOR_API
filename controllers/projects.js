const Project = require('../models/project');
const File    = require('../models/file');
const User    = require('../models/user');
const fs      = require('fs');
const path    = require('path');
const env     = require('../env');

class ProjectsController
{
    static index(request, response)
    {
        User.find(request.authenticated_user_id)
        .then(function(users) {
            var user = new User(users[0].data);

            user.projects(Project)
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
        var project = null;

        Project.find(request.params.id)
        .then(function(project_res) {
            project = new Project(project_res[0].data);

            project.file_tree()
            .then(function(file_tree) {
                project.file_tree = file_tree;

                project.users()
                .then(function(users_res) {
                    project.users = users_res;

                    response.send(project);
                })
                .catch(function(users_err) {
                    response.status(500).send(users_err);
                });

            })
            .catch(function(file_tree_err) {
                response.status(500).send(file_tree_err);
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

            var location = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

            fs.mkdirSync("storage/" + location);

            var root_dir = new File({
               name: '/',
               type: 'd',
               project_id: project_res.insertId,
               created_by: request.authenticated_user_id,
               location: location,
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

        Project.query()
        .where('id', '=', request.params.id)
        .destroy()
        .then(function(res) {
            response.send({
                message: "Project deleted"
            });
        })
        .catch(function(err) {
            response.status(500).send(err);
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

    static files(request, response)
    {
        Project.find(request.params.id)
        .then(function(project_res) {
            var project = new Project(project_res[0].data);

            project.file_tree()
            .then(function(file_tree) {
                response.send(file_tree);
            })
            .catch(function(file_tree_err) {
                response.status(500).send(file_tree_err);
            });

        })
        .catch(function(err) {
            response.send(err);
        });
    }

    static add_file(request, response)
    {
        File.find(request.body.father_id)
        .then(function(files) {

            if (!files.length) {
                response.status(404).send("Father not found");
                return;
            }

            var father = new File(files[0].data);

            var location = father.data.location
                         + '/'
                         + Math.random().toString(36).substring(2, 15)
                         + Math.random().toString(36).substring(2, 15);

            var content = Buffer.from(request.body.file, 'base64');

            try {
                fs.writeFileSync(location, content);
            } catch (e) {
                response.status(500).send(e);
                return;
            }

            var file = new File({
                name:       request.body.name,
                type:       'f',
                project_id: request.params.id,
                created_by: request.authenticated_user_id,
                father_id:  request.body.father_id,
                location:   location,
            });

            file.save()
            .then(function(res) {
                response.send("File created");
            })
            .catch(function(save_err) {
                response.status(500).send(save_err);
            });

        })
        .catch(function(file_err) {
            response.status(500).send(file_err);
        });

    }

    static add_dir(request, response)
    {
        File.find(request.body.father_id)
        .then(function(files) {

            if (!files.length) {
                response.status(404).send("Father not found");
                return;
            }

            var father = new File(files[0].data);

            var location = env.storage_dir
                         + '/'
                         + father.data.location
                         + '/'
                         + Math.random().toString(36).substring(2, 15)
                         + Math.random().toString(36).substring(2, 15);

            fs.mkdirSync(location);

            var dir = new File({
                name:       request.body.name,
                type:       'd',
                project_id: request.params.id,
                created_by: request.authenticated_user_id,
                father_id:  request.body.father_id,
                location:   location,
            });

            dir.save()
            .then(function(res) {
                response.send("Directory created");
            })
            .catch(function(save_err) {
                response.status(500).send(save_err);
            });

        })
        .catch(function(file_err) {
            response.status(500).send(file_err);
        });

    }

    static download(request, response)
    {

    }
}

module.exports = ProjectsController;
