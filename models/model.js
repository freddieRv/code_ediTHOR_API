class Model
{

    // table()
    // {
    //     return '';   -------------- IDEA: One way
    // }

    constructor()
    {
        // instantiate object with data from db
    }

    update(new_data)
    {
        // Iterate over new_data array and construct update query
    }

    static all()
    {
        // Get all elements
    }

    static find(ids)
    {
        // Find one or more elements
    }

    static destroy(ids)
    {
        // Delete one or more elements
    }
}

// Model.table = ''; ----------- IDEA: Another way

module.exports = Model;
