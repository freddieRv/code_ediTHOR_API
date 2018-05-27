module.exports = {
    command(location, name)
    {
        var splited = name.split(".");
        var lang    = splited[splited.length - 1];
        var command = {};

        switch (lang) {
            case "py":
                command.push(`python ${file}`);
                break;

            case "c": case "cpp":
                var output_file = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                command.push(`g++ ${file} -o ${output_file}`);
                command.push(`./${output_file}`);
                break;

            case "java":
                var path        = file.split("/");
                var file_name   = path[path.length - 1].split(".")[0];
                var output_file = "file_name" + ".class";

                command.push(`javac ${file}`);
                command.push(`java ${output_file}`);
                break;
        }

        return command;
    }
}
