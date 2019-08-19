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
const client = new Client(process.env.DATABASE_URL)

client.connect();
client.on("error", err => handleError(err))

function Book(book) {
  // Prevent mixed-content warnings
  this.image = book.volumeInfo.imageLinks
    ? "https" + book.volumeInfo.imageLinks.thumbnail.slice(4)
    : "https://www.freeiconspng.com/uploads/book-icon--icon-search-engine-6.png";
  this.title = book.volumeInfo.title ? book.volumeInfo.title : "No title available";
  this.author = book.volumeInfo.authors ? book.volumeInfo.authors[0] : "No author available";
  this.industryIdentifiers = book.volumeInfo.industryIdentifiers === undefined ? book.volumeInfo.industryIdentifiers = "Not Available" 
  : book.volumeInfo.industryIdentifiers[0].type === 'ISBN_13' ? `ISBN_13 ${book.volumeInfo.industryIdentifiers[0].identifier}` 
  : book.volumeInfo.industryIdentifiers[0].type === 'ISBN_10' ? `ISBN_13 ${book.volumeInfo.industryIdentifiers[1].identifier}` 
  : book.volumeInfo.industryIdentifiers[0].type === 'OTHER' ? book.volumeInfo.industryIdentifiers = splitElements(book.volumeInfo.industryIdentifiers[0]) 
  :"Not Available"
  this.description = book.volumeInfo.description
    ? book.volumeInfo.description
    : "No description available";
  this.id = book.id
    ? book.id
    : "No id Available";
    loadDB(this);
}

app.get("/", (request, response) => {
  try {
    response.render("pages/index");
  } catch {
    handleError(response, err);
  }
});

app.get("/hello", (request, response) => {
  try {
    response.render("pages/index");
  } catch {
    handleError(response, err);
  }
});

app.get("*", nullPage);

app.post("/search", (request, response) => {
  client.query(`SELECT * FROM booksearch WHERE title LIKE '%${request.body.search[0]}%';`).then(result => {
    result.rowCount <= 0 ? searchApi(request, response) : result.rowCount > 0 ? pullDb() : "Broken"
  })
});

function loadDB(data){
    const SQL = `INSERT INTO booksearch (image, title, author, industryidentifiers, description, id) VALUES ($1, $2, $3, $4, $5, $6);`;
    let values = [
      data.image,
      data.title,
      data.author,
      data.industryIdentifiers,
      data.description,
      data.id
    ];
    client.query(SQL, values);
};

function pullDb(){
  client.query(`SELECT * FROM booksearch WHERE title LIKE '%${request.body.search[0]}%';`).then(result => {
    
  })
};

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

function splitElements(element){
  let splitEl = element.identifier.split(':').pop();
  return `Other ` + splitEl;
}

function nullPage(request, response) {
  let err = 404;
  handleError(request, response, err);
};

function handleError(request, response, err) {
  response.redirect(err, "..");
};

app.listen(PORT, () => console.log(`Listening on port number ${PORT}`));
