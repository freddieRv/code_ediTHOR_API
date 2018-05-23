const Model = require('../base/model');

class User extends Model
{
    constructor(data)
    {
        super(data);
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
            'password'
        ];
    }

    static instance(data)
    {
        return new User(data);
    }

    projects(Project)
    {
        return this.belongsToMany(Project, 'project_user', 'user_id', 'project_id');
    }
}

module.exports = User;
