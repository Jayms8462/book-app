"use strict";
const express = require("express");
const superagent = require("superagent");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
const { Client } = require("pg");
require("dotenv").config();

app.set("view engine", "ejs");
app.use(cors());
app.use(express.static("./public/../"));
app.use(express.urlencoded({ extended: true }));
const client = new Client(process.env.DATABASE_URL);
client.connect();
client.on("error", err => handleError(err));

const methodOverride = require("method-override");
app.use(
  methodOverride((request, response) => {
    //
    if (
      request.body &&
      typeof request.body === "object" &&
      "_method" in request.body
    ) {
      let method = request.body._method;
      delete request.body._method;
      return method;
    }
  })
);

app.get("/books/:id", getBookDetails);
app.delete("/books/:id", deleteBook);
app.get("/", (request, response) => {
  try {
    response.render("pages/index");
  } catch {
    handleError(response, err);
  }
});

app.post("/search", (request, response) => {
  client
    .query(
      `SELECT * FROM booksearch WHERE title LIKE '%${request.body.search[0]}%';`
    )
    .then(result => {
      result.rowCount <= 0
        ? searchApi(request, response)
        : result.rowCount > 0
        ? pullDb(request, response)
        : "Broken";
    });
});
app.post("/books", dbAdd);
app.get("*", nullPage);

function Book(book) {
  // Prevent mixed-content warnings
  this.image = book.volumeInfo.imageLinks
    ? "https" + book.volumeInfo.imageLinks.thumbnail.slice(4)
    : "https://www.freeiconspng.com/uploads/book-icon--icon-search-engine-6.png";
  this.title = book.volumeInfo.title
    ? book.volumeInfo.title
    : "No title available";
  this.author = book.volumeInfo.authors
    ? book.volumeInfo.authors[0]
    : "No author available";
  this.isbn =
    book.volumeInfo.industryIdentifiers === undefined
      ? (book.volumeInfo.industryIdentifiers = "Not Available")
      : book.volumeInfo.industryIdentifiers[0].type === "ISBN_13"
      ? `ISBN_13 ${book.volumeInfo.industryIdentifiers[0].identifier}`
      : book.volumeInfo.industryIdentifiers[0].type === "ISBN_10"
      ? `ISBN_13 ${book.volumeInfo.industryIdentifiers[1].identifier}`
      : book.volumeInfo.industryIdentifiers[0].type === "OTHER"
      ? (book.volumeInfo.industryIdentifiers = splitElements(
          book.volumeInfo.industryIdentifiers[0]
        ))
      : "Not Available";
  this.description = book.volumeInfo.description
    ? book.volumeInfo.description
    : "No description available";
  loadDB(this);
}

function getBookDetails(request, response) {
  let id = request.params.id ? request.params.id : parseInt(request.body.id);
  let SQL = "SELECT * FROM booksearch WHERE id=$1;";
  console.log("IDDDEEE: ", [id]);
  client.query(SQL, [id]).then(results => {
    console.log("RESSSULLTS: ", results.rows);
    response.render("pages/searches/show", { bookResults: results.rows });
  });
}

function dbAdd(request, response) {
  loadDB(request.body.book);
  pullAddedBookFromDb(request, response);
}

function loadDB(data) {
  const SQL = `INSERT INTO booksearch (image, title, author, isbn, description, bookshelf) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`;
  let values = [
    data.image ? data.image : data.image === undefined ? data[0] : "",
    data.title ? data.title : data.title === undefined ? data[1] : "",
    data.author ? data.author : data.author === undefined ? data[2] : "",
    data.isbn ? data.isbn : data.isbn === undefined ? data[3] : "",
    data.description
      ? data.description
      : data.description === undefined
      ? data[4]
      : "",
    data.bookshelf
      ? data.bookshelf
      : data.bookshelf === undefined
      ? data[5]
      : ""
  ];
  client.query(SQL, values);
}

function pullDb(request, response) {
  client
    .query(
      `SELECT * FROM booksearch WHERE title LIKE '%${request.body.search[0]}%';`
    )
    .then(data => {
      let results = [];
      for (let i = 0; i < data.rowCount; i++) {
        let result = {
          image: data.rows[i].image,
          title: data.rows[i].title,
          author: data.rows[i].author,
          isbn: data.rows[i].isbn,
          description: data.rows[i].description,
          id: data.rows[i].id
        };
        results.push(result);
      }
      console.log("Pull From DB");
      response.render("pages/searches/show", { bookResults: results });
    });
}

function pullAddedBookFromDb(request, response) {
  let arr = [];
  let obj = {
    image: request.body.book[0],
    title: request.body.book[1],
    author: request.body.book[2],
    isbn: request.body.book[3],
    description: request.body.book[4],
    bookshelf: request.body.book[5],
    id: request.body.book[6]
  };
  arr.push(obj);
  client
    .query(
      `SELECT * FROM booksearch WHERE bookshelf LIKE '${request.body.book[5]}';`
    )
    .then(result => {
      response.render("pages/searches/show", { bookResults: result.rows });
    });
}

function searchApi(request, response) {
  let url = "https://www.googleapis.com/books/v1/volumes?q=";
  request.body.search[1] === "author"
    ? (url += `inauthor:${request.body.search[0]}&maxResults=20`)
    : (url += `intitle:${request.body.search[0]}&maxResults=20`);

  return superagent
    .get(url)
    .then(bookList => {
      let books = bookList.body.items.map(book => {
        return new Book(book);
      });
      return books;
    })
    .then(results => {
      response.render("pages/searches/show", { bookResults: results });
    })
    .catch(error => {
      console.log("Superagent Error: ", error);
    });
}

function deleteBook(request, response) {
  let SQL = `DELETE FROM booksearch WHERE id=$1;`;
  let id = request.params.id;

  return client
    .query(SQL, [id])
    .then(response.redirect("/"))
    .catch(error => {
      handleError(response, error);
    });
}

function splitElements(element) {
  let splitEl = element.identifier.split(":").pop();
  return `Other ` + splitEl;
}

function nullPage(request, response) {
  let err = 404;
  handleError(request, response, err);
}

function handleError(request, response, err) {
  response.redirect(err, "..");
}

app.listen(PORT, () => console.log(`Listening on port number ${PORT}`));
