const Model = require('../base/model');
const File  = require('./file');

class Project extends Model
{
    constructor(data)
    {
        super(data);
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

    static instance(data)
    {
        return new Project(data);
    }

    users()
    {
        return this.belongsToMany(Project, 'project_user', 'project_id');
    }

    files()
    {
        return this.hasOneOrMany(File, 'project_id');
    }

}

module.exports = Project;
