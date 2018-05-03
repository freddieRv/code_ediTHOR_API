const Query = require('../utils/query');

class Model
{
    constructor(data={})
    {
        this.data = data;
    }

    update(new_data)
    {
        new_data.keys.forEach(function(key) {
            this.data[key] = new_data[key];
        });

        return this.query().createOrUpdate(this);
    }

    hasOneOrMany(model, foreign_key, key=this.constructor.primary_key())
    {
        var query = new Query(model.table());
        return query.one_relationship(this, model, foreign_key, key);
    }

    belongsToMany(model, intermediate_table, foreign_key, key=this.constructor.primary_key())
    {
        var query = new Query(intermediate_table);
        return query.many_relationship(this, model, foreign_key, key);
    }

    save()
    {
        return this.query().createOrUpdate(this);
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
        return this.query().get();
    }

    static find(ids)
    {
        var res;
        var elements = ids.constructor === Array ? ids : [ids];

        res = this.query().whereIn(this.primary_key(), elements).get();

        // TODO: return new this.constructor(res)
        // or something like that

        return res;
    }

    static destroy(ids)
    {
        var res;
        var elements = ids.constructor === Array ? ids : [ids];

        res = this.query().whereIn(this.primary_key(), elements).destroy();

        return res;
    }

    static query()
    {
        return new Query(this.table());
    }

}

module.exports = Model;
