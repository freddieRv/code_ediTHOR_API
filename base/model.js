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

    belongsToOne(model, foreign_key, key)
    {
        var query = new Query(model.table());
        return query.reverse_one_relationship(this, model, foreign_key, key);
    }

    belongsToMany(model, intermediate_table, foreign_key, related_entity_foreign_key, key=this.constructor.primary_key())
    {
        var query = new Query(model.table());
        return query.many_relationship(this, model, foreign_key, key, related_entity_foreign_key, intermediate_table);
    }

    save()
    {
        var query = new Query(this.constructor.table());
        return query.createOrUpdate(this);
    }

    save_related(related_entity, foreign_key, related_foreign_key=null, intermediate_table=null, pivots={})
    {
        var query = new Query(this.constructor.table());
        return query.save_related(this, related_entity, foreign_key, related_foreign_key, intermediate_table, pivots);
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
                // var parsed_res = [];
                //
                // res.forEach(function(element) {
                //     parsed_res.push(model.instance(element));
                // });

                resolve(res);
            })
            .catch(function(err) {
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
