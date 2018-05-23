module.exports = {
    create_request(request, response, next)
    {
        errors = [];

        if (!request.body['name']) {
            errors.push('name field is required');
        }

        if (!request.body['type']) {
            errors.push('type field is required');
        } else {
            if (!(request.body['type'] == 'd' || request.body['type'] == 'f')) {
                errors.push('type field should be \'d\' or \'f\'');
            }
        }

        if (!request.body['father_id']) {
            errors.push('father_id field is required');
        }

        if (errors.length) {
            response.status(400).send({
                errors: errors,
            });
        } else {
            next();
        }

    }
}
