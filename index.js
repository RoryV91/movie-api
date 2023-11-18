const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const Models = require("./models.js");
const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;
const Actors = Models.Actor;

app.use(morgan("common"));
app.use(express.static("public"));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/myFlix", { useNewUrlParser: true, useUnifiedTopology: true });

app.get("/", (req, res) => {
	res.send("This is the root route for the app.");
});

app.get("/movies", (req, res) => {
    console.log("GET request for all movies");
    Movies.find()
        .then((movies) => {
            res.json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Internal Server Error");
        });
});

app.get("/movies/:title", (req, res) => {
    res.json(movies.find((movie) => {
        return movie.title.toLowerCase() === req.params.title.toLowerCase();
    }));
});

app.get("/genres/:name", (req, res) => {
    res.send("Successful GET request returning data on a single genre.");
});

app.get("/directors/:name", (req, res) => {
    res.send("Successful GET request returning data on a single director.");
});

app.get("/register", (req, res) => {
    res.send("Successful GET request returning form to sign up a single user.");
});

app.post("/register", (req, res) => {
    res.send("Successful POST request saving data on a single user.");
});

app.get("/users/:userId", (req, res) => {
    res.send("Successful GET request returning data on a single user.");
});

app.put("/users/:userId", (req, res) => {
    res.send("Successful PUT request updating data on a single user.");
});

app.get("/users/:userId/favorites", (req, res) => {
    res.send("Successful GET request returning data on a single user's favorites.");
});

app.post("/users/:userId/favorites/add", (req, res) => {
    res.send("Successful POST request adding data to a single user's favorites.");
});

app.delete("/users/:userId/favorites/remove", (req, res) => {
    res.send("Successful DELETE request removing data from a single user's favorites.");
});

app.delete("/users/:userId/deregister", (req, res) => {
    res.send("Successful DELETE request removing a single user from the database.");
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something broke!");
});

app.listen(8080, () => {
	console.log("Your app is listening on port 8080.");
});
