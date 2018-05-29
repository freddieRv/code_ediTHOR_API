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
            'type',
            'project_id',
            'created_at',
            'created_by',
            'updated_at',
            'father_id',
            'location',
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
