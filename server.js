"use strict";

const express = require("express");
const superagent = require("superagent");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
require("dotenv").config();

app.set("view engine", "ejs");
app.use(cors());
app.use(express.static("./public/../"));
app.use(express.urlencoded({ extended: true }));

function Book(book) {
  // Prevent mixed-content warnings
  this.image = "https" + book.volumeInfo.imageLinks.thumbnail.slice(4);
  this.title = book.volumeInfo.title;
  this.author = book.volumeInfo.authors;
  this.description = book.volumeInfo.description;
}

app.get("/", (request, response) => {
  response.render("pages/index");
});

app.get("/hello", (request, response) => {
  response.render("pages/index");
});

app.get('*', handleError);

app.post("/search", (request, response) => {
  let url = "https://www.googleapis.com/books/v1/volumes?q=";
  request.body.search[1] === "author"
    ? (url += `inauthor:${request.body.search[0]}&maxResults=20`)
    : (url += `intitle:${request.body.search[0]}&maxResults=20`);
  console.log("URL!!!! ", url);

  return superagent
    .get(url)
    .then(bookList => {
      return bookList.body.items.map(book => new Book(book));
    })
    .then(results => {
      console.log("RESOOOOO", results);
      response.render("pages/searches/show", { bookResults: results });
    })
    .catch(error => {
      console.log("Superagent Error: ", error);
    });
});

function handleError(request, response, err){
  debugger;
  response.redirect('pages/error');
}

app.listen(PORT, () => console.log(`Listening on port number ${PORT}`));
