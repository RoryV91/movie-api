const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const { ObjectId } = require('mongoose').Types;
const Models = require("./models.js");
const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;
const Actors = Models.Actor;
let auth = require('./auth')(app);
app.use(morgan("common"));
app.use(express.static("public"));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/myFlix", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

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
	const movieTitle = req.params.title;
	Movies.findOne({ title: movieTitle })
		.then((movie) => {
			if (!movie) {
				res.status(404).send("Movie not found");
			} else {
				res.json(movie);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Internal Server Error");
		});
});

app.get("/genres/:name", (req, res) => {
    const genreName = req.params.name;
    Genres.findOne({ name: genreName })
        .then((genre) => {
            if (!genre) {
                res.status(404).send("Genre not found");
            } else {
                res.json(genre);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Internal Server Error");
        });
});

app.get("/directors/:name", (req, res) => {
    const directorName = req.params.name;
    Directors.findOne({ name: directorName })
        .then((director) => {
            if (!director) {
                res.status(404).send("Director not found");
            } else {
                res.json(director);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Internal Server Error");
        });
});

app.post("/users/new", async (req, res) => {
    try {
        const newUser = req.body;
        const user = await Users.create(newUser);
        return res.status(201).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error creating user");
    }
});

app.get("/users/:userId", (req, res) => {
	res.send("Successful GET request returning data on a single user.");
});

app.put("/users/:userId",async (req, res) => {
        try {
            const userId = req.params.userId;
            const updatedInfo = req.body;
    
            const updatedUser = await Users.findByIdAndUpdate(userId, updatedInfo, { new: true });
    
            if (!updatedUser) {
                return res.status(404).send("User not found");
            }
    
            return res.status(200).json(updatedUser);
        } catch (error) {
            console.error(error);
            return res.status(500).send("Error updating user");
        }
});
    

app.get("/users/:userId/favorites", (req, res) => {
	res.send(
		"Successful GET request returning data on a single user's favorites."
	);
});

app.post("/users/:userId/favorites/add", async (req, res) => {
    try {
        const userId = req.params.userId;
        const movieId = req.body.movieId;
        if (!ObjectId.isValid(movieId)) {
            return res.status(400).send("Invalid movieId");
        }
        const user = await Users.findById(userId);

        if (!user) {
            return res.status(404).send("User not found");
        }
        if (!user.user_movie_ids.includes(movieId)) {
            user.user_movie_ids.push(movieId);
            const updatedUser = await user.save();
            return res.status(200).json(updatedUser);
        } else {
            return res.status(400).send("Movie is already in favorites");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error adding movie to favorites");
    }
});

app.delete("/users/:userId/favorites/remove", async (req, res) => {
    try {
        const userId = req.params.userId;
        const movieId = req.body.movieId;
        if (!ObjectId.isValid(movieId)) {
            return res.status(400).send("Invalid movieId");
        }
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        const movieIndex = user.user_movie_ids.indexOf(movieId);
        if (movieIndex !== -1) {
            user.user_movie_ids.splice(movieIndex, 1);
            const updatedUser = await user.save();
            return res.status(200).json(updatedUser);
        } else {
            return res.status(400).send("Movie not found in favorites");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error removing movie from favorites");
    }
});

app.delete("/users/:userId/delete", async (req, res) => {
    try {
        const userId = req.params.userId;
        const deletedUser = await Users.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).send("User not found");
        }
        return res.status(200).json(deletedUser);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error deleting user");
    }
});



app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something broke!");
});

app.listen(8080, () => {
	console.log("Your app is listening on port 8080.");
});
