const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();

app.use(morgan("common"));
app.use(express.static("public"));
app.use(bodyParser.json());

let movies = [
	{
		title: "Blade Runner 2049",
		director: "Denis Villeneuve",
	},
	{
		title: "The Godfather",
		director: "Francis Ford Coppola",
	},
	{
		title: "Jurassic Park",
		director: "Steven Spielberg",
	},
	{
		title: "The Matrix",
		director: "The Wachowskis",
	},
	{
		title: "Drive",
		director: "Nicolas Winding Refn",
	},
	{
		title: "Heat",
		director: "Michael Mann",
	},
	{
		title: "American Psycho",
		director: "Mary Harron",
	},
	{
		title: "Nightcrawler",
		director: "Dan Gilroy",
	},
	{
		title: "Talladega Nights: The Ballad of Ricky Bobby",
		director: "Adam McKay",
	},
	{
		title: "Tropic Thunder",
		director: "Ben Stiller",
	},
];

app.get("/", (req, res) => {
	res.send("This is the root route for the app.");
});

app.get("/movies", (req, res) => {
	res.json(movies);
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
