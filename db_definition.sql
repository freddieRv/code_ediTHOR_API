CREATE TABLE IF NOT EXISTS users (
    id    INT(10)     NOT NULL AUTO_INCREMENT,
    email VARCHAR(30) NOT NULL UNIQUE,
    name  VARCHAR(25) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS contacts (
    id          INT(10) NOT NULL AUTO_INCREMENT,
    follower_id INT(10) NOT NULL,
    followed_id INT(10) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (followed_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS directories (
    id     INT(10)     NOT NULL AUTO_INCREMENT,
    name   VARCHAR(30) NOT NULL,
    father INT(10),
    PRIMARY KEY (id),
    FOREIGN KEY (father) REFERENCES directories(id)
);

CREATE TABLE IF NOT EXISTS projects (
    id          INT(10)     NOT NULL AUTO_INCREMENT,
    name        VARCHAR(50) NOT NULL,
    root_dir_id INT(10)     NOT NULL,
    created_at  TIMESTAMP   NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (root_dir_id) REFERENCES directories(id)
);

CREATE TABLE IF NOT EXISTS roles (
    id          INT(10)     NOT NULL AUTO_INCREMENT,
    name        VARCHAR(50) NOT NULL,
    description TEXT        NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS project_user (
    id         INT(10) NOT NULL AUTO_INCREMENT,
    project_id INT(10) NOT NULL,
    user_id    INT(10) NOT NULL,
    role_id    INT(10) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (user_id)    REFERENCES users(id),
    FOREIGN KEY (role_id)    REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS files (
    id         INT(10)      NOT NULL AUTO_INCREMENT,
    name       VARCHAR(25)  NOT NULL,
    dir_id     INT(10)      NOT NULL,
    created_at TIMESTAMP    NOT NULL,
    updated_at TIMESTAMP    NOT NULL,
    created_by INT(10)      NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (dir_id)     REFERENCES directories(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
