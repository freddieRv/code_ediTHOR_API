CREATE TABLE IF NOT EXISTS users (
    id       INT(10)      NOT NULL AUTO_INCREMENT,
    username VARCHAR(25)  NOT NULL,
    email    VARCHAR(30)  NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    active   BOOLEAN      NOT NULL DEFAULT 1,
    role_id  INT(10)      NOT NULL DEFAULT 2,
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

CREATE TABLE IF NOT EXISTS projects (
    id          INT(10)     NOT NULL AUTO_INCREMENT,
    name        VARCHAR(50) NOT NULL,
    created_at  TIMESTAMP   NOT NULL,
    description TEXT        NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS files (
    id         INT(10)        NOT NULL AUTO_INCREMENT,
    name       VARCHAR(100)   NOT NULL,
    type       ENUM('f', 'd') NOT NULL,
    project_id INT(20)        NOT NULL,
    created_at TIMESTAMP      NOT NULL,
    created_by INT(10)        NOT NULL,
    updated_at TIMESTAMP      NULL,
    location   VARCHAR(100)   NULL,
    father_id  INT(10)        NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (father_id)  REFERENCES files(id)    ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
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
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    FOREIGN KEY (role_id)    REFERENCES roles(id)
);

INSERT INTO roles (name, description) VALUES ('admin', 'Has permissions over all users and projects');
INSERT INTO roles (name, description) VALUES ('user', 'Normal user, can create and administrate projects');
INSERT INTO roles (name, description) VALUES ('project_admin', 'Has all permissions over projects. Can add and remove users as well as files and directories');
INSERT INTO roles (name, description) VALUES ('project_tester', 'Has limited permissions over projects.');
INSERT INTO roles (name, description) VALUES ('project_developer', 'Has limited permissions over projects.');
