const Model = require('../base/model');
const Query = require('../utils/query');

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
            'active'
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

    role(Role)
    {
        return this.belongsToOne(Role, 'role_id', 'id');
    }

    files()
    {
        var query = new Query();
        var query_string = `SELECT id FROM files WHERE project_id IN ( SELECT project_id FROM project_user WHERE user_id = ${this.data[this.constructor.primary_key()]} )`;

        return query.exec(query_string);
    }
}

module.exports = User;
