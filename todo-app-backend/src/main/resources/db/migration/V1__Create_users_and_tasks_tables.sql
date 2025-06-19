CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(45) NOT NULL,
                       enabled BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE tasks (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       title VARCHAR(50) NOT NULL,
                       description VARCHAR(250),
                       priority VARCHAR(255),
                       data DATETIME,
                       status VARCHAR(255),
                       user_id BIGINT NOT NULL,
                       CONSTRAINT fk_tasks_users FOREIGN KEY (user_id) REFERENCES users(id)
);