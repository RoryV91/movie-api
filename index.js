const express = require("express");
const morgan = require("morgan");
const app = express();



app.use(morgan('common'));
app.use(express.static('public'));

let topMovies = [
    {
        title: "Blade Runner 2049",
        director: "Denis Villeneuve"
    },
    {
        title: "The Godfather",
        director: "Francis Ford Coppola"
    },
    {
        title: "Jurassic Park",
        director: "Steven Spielberg"
    },
    {
        title: "The Matrix",
        director: "The Wachowskis"
    },
    {
        title: "Drive",
        director: "Nicolas Winding Refn"
    },
    {
        title: "Heat",
        director: "Michael Mann"
    },
    {
        title: "American Psycho",
        director: "Mary Harron"
    },
    {
        title: "Nightcrawler",
        director: "Dan Gilroy"
    },
    {
        title: "Talladega Nights: The Ballad of Ricky Bobby",
        director: "Adam McKay"
    },
    {
        title: "Tropic Thunder",
        director: "Ben Stiller"
    }
];

app.get("/", (req, res) => {
	res.send("This is the root route for the app.");
});

app.get("/movies", (req, res) => {
	res.json(topMovies);
});

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
	console.log("Your app is listening on port 8080.");
});
