const Model = require('../base/model');
const File  = require('./file');
const Query = require('../utils/query');

class Project extends Model
{
    constructor(data)
    {
        super(data);
    }

    static table()
    {
        return 'projects';
    }

    static fillable()
    {
        return [
            'name',
            'root_dir_id',
            'created_at'
        ];
    }

    static instance(data)
    {
        return new Project(data);
    }

    users()
    {
        var query = new Query();
        var query_string = `
            SELECT U.id, U.username, U.email, R.name AS role
            FROM users AS U
            INNER JOIN project_user AS PU
                ON PU.user_id = U.id
            INNER JOIN roles AS R
                ON R.id = PU.role_id
            WHERE PU.project_id = ${this.data.id}
        `;

        return query.exec(query_string);
    }

    find_node(node_id, tree)
    {
        if (tree.id == node_id) {
            return tree;
        }

        var current    = tree;
        var node       = 0;
        var next_nodes = [];

        while (!node) {
            current.children.forEach(function(e) {
                if (e.id == node_id) {
                    node = e;
                } else {
                    next_nodes.push(e);
                }
            });

            if (!node) {
                current = next_nodes.pop();
            }
        }

        return node;
    }

    file_tree()
    {
        var project = this;

        return new Promise(function(resolve, reject) {
            File.query()
            .where('project_id', '=', project.data.id)
            .group_by(['id', 'father_id'])
            .order_by('father_id')
            .exec()
            .then(function(file_res) {

                var file_tree    = [];
                var current_tree = null;
                var depth        = 0;

                file_res.forEach(function(e) {
                    if (!current_tree) {
                        current_tree = {
                            "id": e.id,
                            "text": e.name,
                            "children": []
                        };

                        file_tree[0] = current_tree;
                    } else {

                        if (e.father_id != current_tree.id) {
                            current_tree = project.find_node(e.father_id, file_tree[0]);
                        }

                        current_tree.children.push({
                            "id": e.id,
                            "text": e.name,
                            "children": [],
                            "father_id": e.father_id
                        });
                    }
                });

                resolve(file_tree);
            })
            .catch(function(err) {
                reject(err)
            });
        });
    }
}

module.exports = Project;
