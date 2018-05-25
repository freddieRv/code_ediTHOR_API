const File       = require('../models/file');
const SHELL      = require('shelljs');
const FORMIDABLE = require('formidable');
const FS         = require('fs');

class FilesController
{
    static show(request, response)
    {
        File.find(request.params.id)
        .then(function(res) {

            // TODO: send the actual file instead of the db entity
            // response.download(res.location, res.name);
            response.send(res);
        })
        .catch(function(err) {
            response.send(err);
        });
    }

    static update(request, response)
    {
        response.send(`Edit file with id ${request.params.id}`);
    }

    static destroy(request, response)
    {
        File.query()
        .where('id', '=', request.params.id)
        .destroy()
        .then(function(res) {
            response.send({
                message: 'File deleted',
            });
        })
        .catch(function(err) {
            response.status(500).send(err);
        });
    }

    static exec(request, response)
    {
        var form = new formidable.IncomingForm();

        // specify that we don't want to allow the user to upload multiple files in a single request
        form.multiples = false;

        // store file in the /uploads directory
        form.uploadDir = path.join(__dirname, '/storage');

        // every time a file has been uploaded successfully,
        // rename it to it's orignal name
        form.on('file', function(field, file) {
            fs.rename(file.path, path.join(form.uploadDir, file.name));
        });

        // log any errors that occur
        form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
        });

        // once all the files have been uploaded, send a response to the client
        form.on('end', function() {
            res.end('success');
        });

        // parse the incoming request containing the form data
        form.parse(req);
    }
}

module.exports = FilesController;
