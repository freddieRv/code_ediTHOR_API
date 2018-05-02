const Query = require('../utils/query');

class Model
{
    constructor() { }

    update(new_data)
    {
        console.log(new_data);
    }

    static table()
    {
        return null;
    }

    static fillable()
    {
        return null;
    }

    static primary_key()
    {
        return 'id';
    }

    static create(data)
    {
        console.log(data);
    }

    static all()
    {
        // Get all elements
    }

    static find(ids)
    {
        var res;

        if (ids.constructor === Array) {
            res = this.query().whereIn(this.primary_key(), ids).get();
        } else {
            res = this.query().whereIn(this.primary_key(), [ids]).get();
        }

        return res;
    }

    static destroy(ids)
    {
        // Delete one or more elements
    }

    static query()
    {
        return new Query(this.table());
    }
}

module.exports = Model;
