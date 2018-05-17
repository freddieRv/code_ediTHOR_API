const Model = require('../base/model');
const File  = require('./file');

class Directory extends Model
{
    constructor(data)
    {
        super(data);
    }

    static table()
    {
        return 'directories';
    }

    static fillable()
    {
        return [
            'name',
            'father',
        ];
    }

    static instance(data)
    {
        return new Directory(data);
    }

    father ()
    {
        return this.hasOneOrMany(Directory, 'father');
    }
}

module.exports = Directory;
