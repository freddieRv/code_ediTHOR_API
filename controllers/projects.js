const Project = require('../models/project');
const File    = require('../models/file');
const User    = require('../models/user');
const fs      = require('fs');
const path    = require('path');
const env     = require('../env');
const zipper  = require("zip-local");

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

            var location = project.data.name
                         + "_"
                         + Math.random().toString(36).substring(2, 15);

            fs.mkdirSync(env.storage_dir + location);

            var root_dir = new File({
               name: location,
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

            User.query()
            .where('username', '=', request.body.user)
            .orWhere('email', '=', request.body.user)
            .exec()
            .then(function(users) {

                if (!users.length) {
                    response.status(404).send({
                        message: "User not found"
                    });

                    return;
                }

                var user = new User(users[0]);

                project.users()
                .then(function(users_res) {

                    var belongs_to_project = false;

                    for (var i = 0; i < users_res.length; i++) {
                        if (users_res[i].id == user.data.id) {
                            belongs_to_project = true;
                        }
                    }

                    if (belongs_to_project) {
                        response.status(400).send({
                            message: "User already belongs to project"
                        });
                        return;
                    }

                    project.save_related(user, 'project_id', 'user_id', 'project_user', {role_id: request.body.role})
                    .then(function(res) {
                        response.send({
                            message: "User added to project",
                        });
                    })
                    .catch(function(err) {
                        response.send(err);
                    });

                })
                .catch(function(users_err) {
                    response.status(500).send(users_err);
                });

            })
            .catch(function(user_err) {
                response.status(500).send(user_err);
            });

        })
        .catch(function(err) {
            response.send(err);
        });
    }

    static remove_user(request, response)
    {
        Project.find(request.params.id)
        .then(function(projects) {
            if (!projects.length) {
                response.status(404).send({
                    message: "Project not found"
                });
            }

            var project = new Project(projects[0].data);

            project.remove_user(request.body.user_id)
            .then(function(res) {
                response.send({
                    message: "User removed from project"
                });
            })
            .catch(function(remove_err) {
                response.status(500).send(remove_err);
            });

        })
        .catch(function(projects_err) {
            response.status(500).send(project_err);
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
                response.status(404).send({
                    message: "Father not found"
                });

                return;
            }

            var father   = new File(files[0].data);
            var content  = Buffer.from(request.body.file, 'base64');
            var location = father.data.location + '/';

            try {
                fs.writeFileSync(env.storage_dir + location + request.body.name, content);
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
                response.send({
                    message: "File created"
                });
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
                response.status(404).send({
                    message: "Father not found"
                });

                return;
            }

            var father = new File(files[0].data);

            var location = father.data.location
                         + '/'
                         + request.body.name;

            fs.mkdirSync(env.storage_dir + location);

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
                response.send({
                    message: "Directory created"
                });
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
        Project.find(request.params.id)
        .then(function(projects) {

            var project = new Project(projects[0].data);

            project.file_tree()
            .then(function(file_tree) {
                var root_dir = env.storage_dir + file_tree[0].text;
                var zipped   = env.storage_dir + project.data.name + ".zip"
                zipper.sync.zip(root_dir).compress().save(zipped);

                response.download(zipped);
            })
            .catch(function(file_tree_err) {
                response.status(500).send(file_tree_err);
            });

        })
        .catch(function(project_err) {
            response.status(500).send(project_err);
        });
    }
}

module.exports = ProjectsController;
