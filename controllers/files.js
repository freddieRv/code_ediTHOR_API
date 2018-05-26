const File       = require('../models/file');
const shell      = require('shelljs');

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
        
    }
}

module.exports = FilesController;
