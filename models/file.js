const Model = require('../base/model');

class File extends Model
{
    constructor(data)
    {
        super(data);
    }

    static table()
    {
        return 'files';
    }

    static fillable()
    {
        return [
            'name',
            'path',
            'project_id',
        ];
    }

    static instance(data)
    {
        return new File(data);
    }

    project()
    {
        return this.belongsToMany(Project, this.table(), 'project_id');
    }
}

module.exports = File;
