# Book App

**Author**: James Dunn and James Portune
**Version**: 1.0.0

## Overview

To utilize the Google Book API to pull searched titles or authors and store the data in out Databse if it does not already exist in the DB.

Color Palette- Chosen off colors insread of hard colors to make it easier on the eyes
Header background - #0F0F0F
Main section background - #C0C0C0
Body background - #808080
Sub-heading background - #5a5a5a
Elements - #F0F0F0
Fonts - 1st- Garamond, 2nd- Caslon both chosen out of popular typescript of books.

## Getting Started

For standard users when visiting the page they will only need to search by either Title or the Author that they are searching for. Then they locate the book they are trying to search for. Eventually they will be able to save the book into a collection.

For Developers, all you will need to do is include the sting of the DATABSE_URL in an environment file. They will then be able to do the same above.

## Architecture

Node.Js
Express
Postgres
EJS

all included in the package.json so all that you will need to do is an npm install.

## Change Log

8/15
Added the Base Pages for home and a test for /hello. Also added in a grab for anything that does not exist and redirects people to error page. Superagent call to api to get data and outputs it to the page. Added in call to Error for later use. Added in views for the different pages.
3 hours to complete the above.

8/17
Added Readme information
Added in Styles folder containing Color Palette
