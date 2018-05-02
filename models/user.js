const Model = require('./model');

class User extends Model
{
    constructor()
    {
        super();
    }

    static table()
    {
        return 'users';
    }

    static fillable()
    {
        return [
            'email',
            'username',
            'password',
        ];
    }
}

module.exports = User;
