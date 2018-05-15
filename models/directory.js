const Model = require('../base/model');
const File  = require('./file');

class Directory extends Model
{
    constructor()
    {
        super(data);
    }

    static table(){
        return 'directories';
    }

    static fillable()
    {
        // TODO: put here the attrib of directories
        return [
            'some',
            'data'
        ];
    }

    static instance(data)
    {
        return new Directory(data);
    }

    directory()
    {
        return this.belongsToMany(Directory, 'directory_id');
    }
}
