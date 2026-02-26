# Dogs App 🐶

Dogs App is a simple web application written in **Go (Golang)** that displays information about dogs from a SQLite database.

This was one of my **first backend projects in Go**, created to practice building a simple web server, working with databases, and creating an API.

The application includes:
- a Go backend
- a SQLite database
- a small frontend in HTML, CSS, and JavaScript

## Features

- simple REST API
- pagination (page & limit)
- SQLite database
- static frontend served by Go

## Technologies

- Go (Golang)
- SQLite
- HTML
- CSS
- JavaScript
- net/http

## API

Endpoint:


GET /api/dogs


Example:


http://localhost:8080/api/dogs?page=1&limit=5


## How to run

1. Clone the repository


git clone https://github.com/callmemathew/Dogs-App.git


2. Go to the project folder


cd dogs-app


3. Run the application


go run main.go


4. Open in browser


http://localhost:8080


## Project Structure


dogs-app
│
├── main.go
├── dogs.db
└── static
├── index.html
├── style.css
└── script.js


## Author

Mathew
