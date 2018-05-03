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
            'password',
        ];
    }

    projects()
    {
        return this.belongsToMany(Project, 'project_user', 'user_id');
    }
}

module.exports = User;
