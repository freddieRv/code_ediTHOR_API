const Model = require('../base/model');

class Role extends Model
{
    constructor(data)
    {
        super(data);
    }

    static table()
    {
        return 'roles';
    }

    static fillable()
    {
        return [
            'name',
            'description',
        ];
    }

    static instance(data)
    {
        return new Role(data);
    }

}

module.exports = Role;
