const File      = require('../models/file');
const compilers = require('../utils/compilers');
const fs        = require('fs');
const env       = require('../env');

class FilesController
{
    static show(request, response)
    {
        File.find(request.params.id)
        .then(function(res) {

            if (res[0].data.type == "d") {
                response.status(400).send({
                    message: "Requested file is a directory"
                });
                return;
            }

            var file_path = env.storage_dir + res[0].data.location + res[0].data.name;

            fs.readFile(file_path, function read(err, content) {
                if (err) {
                    response.status(500).send(err);
                    return;
                }

                var encoded = Buffer.from(content).toString('base64');

                response.send({
                    id:      res[0].data.id,
                    name:    res[0].data.name,
                    content: encoded,
                });
            });

        })
        .catch(function(err) {
            response.send(err);
        });
    }

    static update(request, response)
    {
        File.find(request.params.id)
        .then(function(files) {

            // if (files[0].data.type == "d") {
            //     response.status(400).send({
            //         message: "Requested file is a directory"
            //     });
            //     return;
            // }

            var file     = new File(files[0].data);
            var old_name = 0;

            if (request.body['father_id']) {
                file.data.father_id = request.body.father_id;

                // TODO: move actual file

            }

            if (request.body['name']) {
                old_name       = files[0].data.name;
                file.data.name = request.body['name'];
            }

            if (request.body['content'] && file.data.type == "f") {
                var buffered_content = Buffer.from(request.body.content, 'base64');
                var file_path        = env.storage_dir + file.data.location + file.data.name;

                try {

                    fs.writeFileSync(file_path, buffered_content);

                    if (old_name && old_name != file.data.name) {
                        fs.unlinkSync(env.storage_dir + file.data.location + old_name);
                    }

                } catch (e) {
                    response.status(500).send(e);
                    return;
                }

                file.save()
                .then(function(save_res) {
                    response.send({
                        message: "File updated",
                    });
                })
                .catch(function(save_err) {
                    response.status(500).send(save_err);
                });

            }

        })
        .catch(function(err) {
            response.send(err);
        });
    }

    static destroy(request, response)
    {
        File.find(request.params.id)
        .then(function(files) {

            var path_to_delete = env.storage_dir + files[0].data.location + files[0].data.name;

            File.query()
            .where('id', '=', request.params.id)
            .destroy()
            .then(function(res) {

                try {
                    fs.unlinkSync(path_to_delete);
                } catch (e) {}

                response.send({
                    message: 'File deleted',
                });
            })
            .catch(function(err) {
                response.status(500).send(err);
            });

        })
        .catch(function(find_err) {
            response.status(500).send(find_err);
        });

    }

    static exec(request, response)
    {
        File.find(request.params.id)
        .then(function(files) {
            if (!files.length) {
                response.status(404).send({
                    message: "File not found"
                });
                return;
            }

            var console_log = compilers.run(files[0].data.location, files[0].data.name);

            response.send(console_log);

        })
        .catch(function(file_err) {
            response.status(500).send(file_err);
        });

    }
}

module.exports = FilesController;
