const Query = require('../utils/query');

class Model
{
    constructor() { }

    update(new_data)
    {
        console.log(new_data);
    }

    hasOne($model, $key=this.primary_key, $foreign_key='id')
    {

    }

    hasMany($model, $key=this.primary_key, $foreign_key='id')
    {

    }

    belongsTo($model, $key=this.primary_key, $foreign_key='id')
    {

    }

    belongsToMany($model, $intermediate_table, $key=this.primary_key, $foreign_key='id')
    {
        
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

        if (ids.constructor === Array) {
            res = this.query().whereIn(this.primary_key(), ids).get();
        } else {
            res = this.query().whereIn(this.primary_key(), [ids]).get();
        }

        return res;
    }

    static destroy(ids)
    {
        var res;

        if (ids.constructor === Array) {
            res = this.query().whereIn(this.primary_key(), ids).destroy();
        } else {
            res = this.query().whereIn(this.primary_key(), [ids]).destroy();
        }

        return res;
    }

    static query()
    {
        return new Query(this.table());
    }

}

module.exports = Model;
