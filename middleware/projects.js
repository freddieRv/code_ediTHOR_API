module.exports = {
    create_request(request, response, next)
    {
        errors = [];

        if (!request.body['name']) {
            errors.push('name field is required');
        }

        if (!request.body['description']) {
            errors.push('description field is required');
        }

        if (errors.length) {
            response.status(400).send({
                erros: errors,
            });
        } else {
            next();
        }

    }
}
