const shell = require('shelljs');
const env   = require('../env');

function command(location, name)
{
    var splited  = name.split(".");
    var lang     = splited[splited.length - 1];
    var commands = [];
    var file_path = env.app_dir + env.storage_dir + location + name;

    switch (lang) {
        case "py":
            commands.push(`python2 ${file_path}`);
            break;

        case "c": case "cpp":
            var output_file = env.app_dir
                            + env.storage_dir
                            + Math.random().toString(36).substring(2, 15)
                            + Math.random().toString(36).substring(2, 15);

            commands.push(`g++ ${file_path} -o ${output_file}`);
            commands.push(`${output_file}`);
            break;

        case "java":
            var exec_path = file_path.split(".")[0];
            commands.push(`javac ${file_path}`);
            commands.push(`java ${exec_path}`);
            break;
    }

    return commands;
}

module.exports = {
    run(location, name)
    {
        var response = {
            status: 0,
            console_log: []
        };

        var commands = command(location, name);
        var log      = "";

        for (var i = 0; i < commands.length; i++) {
            log = shell.exec(commands[i], {silent: false});

            if (log.stderr) {
                response.status = 1;
                response.console_log.push(log.stderr);
            } else {
                response.console_log.push(log.stdout);
            }
        }

        return response;
    }
}
