DROP TABLE IF EXISTS booksearch;

CREATE TABLE booksearch (
     id TEXT PRIMARY KEY,
     image TEXT,
     title TEXT,
     author TEXT,
     industryidentifiers VARCHAR(50),
     isbn VARCHAR(50),
     description TEXT,
     bookshelf TEXT
);