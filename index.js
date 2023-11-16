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


let movies = [
	{
        id: 1,
		title: "Blade Runner 2049",
        description: "Blade Runner 2049 is a 2017 American neo-noir science fiction film directed by Denis Villeneuve and written by Hampton Fancher and Michael Green.",
		director: {
            name: "Denis Villeneuve",
            bio: "Denis Villeneuve is a French Canadian film director, writer, and producer.",
            birth: "1967",
            death: "N/A",
        },
        genre: {
            name: "Science Fiction",
            description: "Science fiction is a genre of speculative fiction that typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.",
        },
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/9b/Blade_Runner_2049_poster.png",
        featured: true,
	},
	{   
        id: 2,
		title: "The Godfather",
		director: {
            name: "Francis Ford Coppola",
            bio: "Francis Ford Coppola is an American film director, producer, screenwriter and film composer.",
            birth: "1939",
            death: "N/A",
        },
        genre: {
            name: "Crime",
            description: "Crime films, in the broadest sense, are a cinematic genre inspired by and analogous to the crime fiction literary genre.",    
        },
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg",
        featured: true,
	},
	{   
        id: 3,
		title: "Jurassic Park",
		director: {
            name: "Steven Spielberg",
            bio: "Steven Allan Spielberg is an American film director, producer, and screenwriter.",
            birth: "1946",
            death: "N/A",
        },
        genre: {
            name: "Science Fiction",
            description: "Science fiction is a genre of speculative fiction that typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.",
        },
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/e/e7/Jurassic_Park_poster.jpg",
        featured: true,
	},
	{   
        id: 4,
		title: "The Matrix",
		director: {
            name: "The Wachowskis",
            bio: "Lana Wachowski and Lilly Wachowski, known together professionally as the Wachowskis, are Polish-American film and television directors, writers and producers.",
            birth: "1965",
            death: "N/A",
        },
        genre: {
            name: "Science Fiction",
            description: "Science fiction is a genre of speculative fiction that typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.",
        },
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg",
        featured: true,
	},
	{   
        id: 5,
		title: "Drive",
		director: {
            name: "Nicolas Winding Refn",
            bio: "Nicolas Winding Refn is a Danish film director, screenwriter and producer.",
            birth: "1970",
            death: "N/A",
        },
        genre: {
            name: "Action",
            description: "Action film is a film genre in which the protagonist or protagonists are thrust into a series of events that typically include violence, extended fighting, physical feats, rescues and frantic chases.",
        },
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/13/Drive2011Poster.jpg",
        featured: true,
	},
	{   
        id: 6,
		title: "Heat",
		director: {
            name: "Michael Mann",
            bio: "Michael Kenneth Mann is an American film director, screenwriter, and producer of film and television.",
            birth: "1943",
            death: "N/A",
        },
        genre: {
            name: "Action",
            description: "Action film is a film genre in which the protagonist or protagonists are thrust into a series of events that typically include violence, extended fighting, physical feats, rescues and frantic chases.",
        },
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/6/6c/Heatposter.jpg",
        featured: true,
	},
	{   
        id: 7,
		title: "American Psycho",
		director: {
            name: "Mary Harron",
            bio: "Mary Harron is a Canadian filmmaker and screenwriter.",
            birth: "1953",
            death: "N/A",
        },
        genre: {
            name: "Thriller",
            description: "Thriller film, also known as suspense film or suspense thriller, is a broad film genre that evokes excitement and suspense in the audience.",
        },
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/6/63/Americanpsychoposter.jpg",
        featured: true,
	},
	{   
        id: 8,
		title: "Nightcrawler",
		director: {
            name: "Dan Gilroy",
            bio: "Daniel Christopher Gilroy is an American screenwriter and film director.",
            birth: "1959",
            death: "N/A",
        },
        genre: {
            name: "Thriller",
            description: "Thriller film, also known as suspense film or suspense thriller, is a broad film genre that evokes excitement and suspense in the audience.",
        },
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/d/d4/Nightcrawlerfilm.jpg",
        featured: true,
	},
	{   
        id: 9,
		title: "Talladega Nights: The Ballad of Ricky Bobby",
		director: {
            name: "Adam McKay",
            bio: "Adam McKay is an American film director, producer, screenwriter, comedian, and actor.",
            birth: "1968",
            death: "N/A",
        },
        genre: {
            name: "Comedy",
            description: "Comedy is a genre of film in which the main emphasis is on humor.",
        },
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/13/Talladega_nights_poster.jpg",
        featured: true,
	},
	{   
        id: 10,
		title: "Tropic Thunder",
		director: {
            name: "Ben Stiller",
            bio: "Benjamin Edward Meara Stiller is an American actor, comedian, writer, producer, and director.",
            birth: "1965",
            death: "N/A",
        },
        genre: {
            name: "Comedy",
            description: "Comedy is a genre of film in which the main emphasis is on humor.",
        },
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/d/d6/Tropic_thunder_ver3.jpg",
        featured: true,
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
