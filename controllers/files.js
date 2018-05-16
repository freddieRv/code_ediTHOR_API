const File = require('../models/file');

class FilesController
{
    static index(request, response)
    {
        File.all()
        .then(function(res) {
            response.send(res);
        })
        .catch(function(err) {
            response.send(err);
        });
    }

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

    static store(request, response)
    {
        response.send('Files store');
    }

    static update(request, response)
    {
        response.send(`Edit file with id ${request.params.id}`);
    }

    static destroy(request, response)
    {
        response.send(`Delete file with id ${request.params.id}`);
    }
}

module.exports = FilesController;
