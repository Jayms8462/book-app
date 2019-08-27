DROP TABLE IF EXISTS booksearch;

CREATE TABLE booksearch (
     id SERIAL PRIMARY KEY,
     image TEXT,
     title TEXT,
     author TEXT,
     isbn VARCHAR(50),
     description TEXT,
     bookshelf TEXT
);