const File = require('../models/file');

class FilesController
{
    static show(request, response)
    {
        File.find(request.params.id)
        .then(function(res) {
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
}

module.exports = FilesController;
