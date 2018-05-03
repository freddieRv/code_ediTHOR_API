const Model = require('./model');

class Project extends Model
{
    constructor()
    {
        super();
    }

    static table()
    {
        return 'projects';
    }

    static fillable()
    {
        return [
            'name',
        ];
    }

    users()
    {
        return this.belongsToMany(Project, 'project_user', 'project_id');
    }

}

module.exports = Project;
