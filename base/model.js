const Query = require('../utils/query');

class Model
{
    constructor(data={})
    {
        this.data = data;
    }

    update(new_data)
    {
        var user = this;

        Object.keys(new_data).forEach(function(key) {
            user.data[key] = new_data[key];
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
        var query = new Query(this.constructor.table());
        return query.createOrUpdate(this);
    }

    static table()
    {
        return null;
    }

    static instance(data)
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

    static all()
    {
        var model = this;

        return new Promise(function(resolve, reject) {
            model.query().exec()
            .then(function(res) {
                var parsed_res = [];

                res.forEach(function(element) {
                    parsed_res.push(model.instance(element));
                });

                resolve(parsed_res);
            })
            .catch(function(err) {

                // TODO: parse error

                reject(err);
            });
        });
    }

    static find(ids)
    {
        var elements = ids.constructor === Array ? ids : [ids];
        var model    = this;

        return new Promise(function(resolve, reject) {
            model.query().whereIn(model.primary_key(), elements).exec()
            .then(function(res) {
                var parsed_res = [];

                res.forEach(function(element) {
                    parsed_res.push(model.instance(element));
                });

                resolve(parsed_res);
            })
            .catch(function(err) {

                // TODO: parse error

                reject(err);
            });
        });
    }

    static query()
    {
        return new Query(this.table());
    }

}

module.exports = Model;
