const Model     = require('../base/model');
const Directory = require('./directory');

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
            'root_dir_id',
            'created_at',
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

    root_directory()
    {
        return this.hasOneOrMany(Directory, 'project_id');
    }

}

module.exports = Project;
