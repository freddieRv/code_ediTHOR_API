const User = require('../models/user');

module.exports = {

    is_active(request, response, next)
    {
        User.find(request.authenticated_user_id)
        .then(function(users) {
            if (users) {
                if (users[0].data.active) {
                    next();
                }
            } else {
                response.status(401).send("This user is not active");
                next('router');
            }
        })
        .catch(function(users_err) {
            response.status(500).send(users_err);
        });
    },

}
