DROP TABLE IF EXISTS booksearch;

CREATE TABLE booksearch (
     id VARCHAR(50) PRIMARY KEY,
     image TEXT,
     title TEXT,
     author TEXT,
     industryidentifiers VARCHAR(50),
     description TEXT
)

--id, image, title, author, industryidentifiers, description