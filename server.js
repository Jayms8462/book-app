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

app.get("/", (request, response) => {
  try {
    response.render("pages/index");
  } catch {
    handleError(err)
  }
});

app.get("/hello", (request, response) => {
  try {
    response.render("pages/index");
  } catch {
    handleError(err)
  }
});

app.get('*', handleError);


app.post("/search", (request, response) => {
  let url = "http://www.googleapis.com/books/v1/volumes?q=";
  request.body.search[1] === "author"
    ? (url += `inauthor:${request.body.search[0]}`)
    : (url += `intitle:${request.body.search[0]}`);
});

function handleError(request, response, err){
  debugger;
  response.redirect('pages/error');
}


app.listen(PORT, () => console.log(`Listening on port number ${PORT}`));
