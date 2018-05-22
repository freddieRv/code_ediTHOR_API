const Model   = require('../base/model');
const Project = require('./project');

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

    projects()
    {
        return this.belongsToMany(Project, 'project_user', 'user_id', 'project_id');
    }
}

module.exports = User;
