-- this is the initial migration for our app.
-- it sets up restaurants and grades tables.

-- everything between `BEGIN;` and `COMMIT;` at the
-- end succeeds or fails together. for instance
-- if the table creation for `grades` fails,
-- the table for restaurants won't be created.
BEGIN;

CREATE TABLE authors (
	id SERIAL PRIMARY KEY,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL,
	user_name TEXT NOT NULL,
	first_name TEXT,
	last_name TEXT
);

CREATE TABLE posts (
	id SERIAL PRIMARY KEY,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL,
	title TEXT,
    content TEXT,
	author_id INTEGER REFERENCES authors NOT NULL
);

CREATE TABLE comments (
	id SERIAL PRIMARY KEY,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL,
	content TEXT,
	author_id INTEGER REFERENCES authors ON DELETE CASCADE NOT NULL,
	post_id INTEGER REFERENCES posts ON DELETE CASCADE NOT NULL
);

COMMIT;