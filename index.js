// DEPENDENCIES
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');
const app = express();
const { ObjectId } = require('mongoose').Types;
const bcrypt = require('bcrypt'); 
const auth = require('./auth');
const https = require('https');
const fs = require('fs');
const keyPath = require('./config').keyPath;
const certPath = require('./config').certPath;
const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
};
const server = https.createServer(options, app);

// MODELS
const Models = require("./models.js");
const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;
const Actors = Models.Actor;

// PORT
const port = process.env.PORT || 9999;

// MIDDLEWARE
app.use(morgan("common"));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(morgan("common"));
app.use(express.static("public"));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/myFlixAPI", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// USE CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

require('./passport');

// ROUTES

// AUTH
auth(app);

// ROOT
app.get("/", async (req, res) => {
	res.send("This is the root route for the app.");
});

// GET ALL MOVIES
app.get("/movies", async (req, res) => {
	Movies.find()
		.then((movies) => {
			res.json(movies);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send("Internal Server Error");
		});
});

// GET MOVIE BY TITLE
app.get("/movies/:title", passport.authenticate('jwt', { session: false }), async (req, res) => {
	const movieTitle = req.params.title;

    if (typeof movieTitle !== 'string' || movieTitle.trim() === '') {
        return res.status(400).send("Invalid movie title.");
    }

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

// CREATE MOVIE
app.post("/movies/new", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const movieData = req.body;

    if (typeof movieData.title !== 'string' || movieData.title.trim() === '') {
        return res.status(400).send("Invalid movie title.");
    }

    if (typeof movieData.description !== 'string' || movieData.description.trim() === '') {
        return res.status(400).send("Invalid movie description.");
    }

    if (movieData.imageurl && typeof movieData.imageurl !== 'string') {
        return res.status(400).send("Invalid movie image URL.");
    }

    if (movieData.featured && typeof movieData.featured !== 'boolean') {
        return res.status(400).send("Invalid movie featured flag.");
    }

    if (movieData.release && isNaN(Date.parse(movieData.release))) {
        return res.status(400).send("Invalid movie release date.");
    }

    if (movieData.actor_ids && !Array.isArray(movieData.actor_ids)) {
        return res.status(400).send("Invalid movie actor IDs.");
    }
    if (movieData.director_ids && !Array.isArray(movieData.director_ids)) {
        return res.status(400).send("Invalid movie director IDs.");
    }
    if (movieData.genre_ids && !Array.isArray(movieData.genre_ids)) {
        return res.status(400).send("Invalid movie genre IDs.");
    }

    const existingMovie = await Movies.findOne({ title: { $regex: new RegExp(`^${movieData.title}$`, 'i') } });
    if (existingMovie) {
        return res.status(400).send("A movie with this title already exists.");
    }

    const newMovie = await Movies.create(movieData);
    return res.status(201).json(newMovie);
});

// GET GENRE BY NAME
app.get("/genres/:name", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const genreName = req.params.name;

    if (typeof genreName !== 'string' || genreName.trim() === '') {
        return res.status(400).send("Invalid genre name.");
    }

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

// CREATE GENRE
app.post("/genres/new", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const genreData = req.body;

    if (typeof genreData.name !== 'string' || genreData.name.trim() === '') {
        return res.status(400).send("Invalid genre name.");
    }

    if (typeof genreData.description !== 'string' || genreData.description.trim() === '') {
        return res.status(400).send("Invalid genre description.");
    }

    try {
        const existingGenre = await Genres.findOne({ name: { $regex: new RegExp(`^${genreData.name}$`, 'i') } });
        if (existingGenre) {
            return res.status(400).send("A genre with this name already exists.");
        }
        const newGenre = await Genres.create(genreData);
        return res.status(201).json(newGenre);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error creating genre");
    }
});

// UPDATE GENRE BY ID
app.put("/genres/:genreId", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const genreId = req.params.genreId;
    const updatedInfo = req.body;

    if (typeof updatedInfo.name !== 'string' || updatedInfo.name.trim() === '') {
        return res.status(400).send("Invalid genre name.");
    }

    if (typeof updatedInfo.description !== 'string' || updatedInfo.description.trim() === '') {
        return res.status(400).send("Invalid genre description.");
    }

    try {
        const updatedGenre = await Genres.findByIdAndUpdate(genreId, updatedInfo, { new: true });
        if (!updatedGenre) {
            return res.status(404).send("Genre not found");
        }
        return res.status(200).json(updatedGenre);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error updating genre");
    }
});

// GET DIRECTOR BY NAME
app.get("/directors/:name", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const directorName = req.params.name;

    if (typeof directorName !== 'string' || directorName.trim() === '') {
        return res.status(400).send("Invalid director name.");
    }

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

// CREATE DIRECTOR
app.post("/directors/new", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const newDirector = req.body;

        if (typeof newDirector.name !== 'string' || newDirector.name.trim() === '') {
            return res.status(400).send("Invalid director name.");
        }

        if (newDirector.bio && typeof newDirector.bio !== 'string' || newDirector.bio.trim() === '') {
            return res.status(400).send("Invalid director bio.");
        }

        if (newDirector.birth && isNaN(Date.parse(newDirector.birth))) {
            return res.status(400).send("Invalid director birth date.");
        }

        if (newDirector.death && isNaN(Date.parse(newDirector.death))) {
            return res.status(400).send("Invalid director death date.");
        }

        const existingDirector = await Directors.findOne({ name: { $regex: new RegExp(`^${newDirector.name}$`, 'i') } });

        if (existingDirector) {
            return res.status(400).send("A director with this name already exists.");
        }

        const director = await Directors.create(newDirector);
        return res.status(201).json(director);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error creating director");
    }
});

// UPDATE DIRECTOR BY ID
app.put("/directors/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const directorId = req.params.id;
        const directorData = req.body;

        if (directorData.name && (typeof directorData.name !== 'string' || directorData.name.trim() === '')) {
            return res.status(400).send("Invalid director name.");
        }

        if (directorData.bio && typeof directorData.bio !== 'string') {
            return res.status(400).send("Invalid director bio.");
        }

        if (directorData.birth && isNaN(Date.parse(directorData.birth))) {
            return res.status(400).send("Invalid director birth date.");
        }

        if (directorData.death && isNaN(Date.parse(directorData.death))) {
            return res.status(400).send("Invalid director death date.");
        }

        const director = await Directors.findByIdAndUpdate(directorId, directorData, { new: true });

        if (!director) {
            return res.status(404).send("Director not found.");
        }

        return res.status(200).json(director);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error updating director");
    }
});

// CREATE USER
app.post("/users/new", async (req, res) => {
    try {
        const newUser = req.body;

        if (typeof newUser.username !== 'string' || newUser.username.length > 32) {
            return res.status(400).send("Invalid username.");
        }

        const existingUser = await Users.findOne({ username: { $regex: new RegExp(`^${newUser.username}$`, 'i') } });

        if (existingUser) {
            return res.status(400).send("This username is already taken.");
        }

        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        newUser.password = hashedPassword;
        const user = await Users.create(newUser);
        return res.status(201).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error creating user");
    }
});

// GET USER BY ID
app.get("/users/:userId", passport.authenticate('jwt', { session: false }), async (req, res) => {
	res.send("Successful GET request returning data on a single user.");
});

// UPDATE USER BY ID
app.put("/users/:userId", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedInfo = req.body;

        if (req.user.id !== userId) {
            return res.status(403).send("You can only update your own information.");
        }

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
    
// GET USER FAVORITES BY ID
app.get("/users/:userId/favorites", passport.authenticate('jwt', { session: false }), async (req, res) => {
	res.send(
		"Successful GET request returning data on a single user's favorites."
	);
});

// ADD MOVIE TO USER FAVORITES
app.post("/users/:userId/favorites/add", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const userId = req.params.userId;
        const movieId = req.body.movieId;

        if (req.user.id !== userId) {
            return res.status(403).send("You can only manage your own favorites.");
        }

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

// REMOVE MOVIE FROM USER FAVORITES
app.delete("/users/:userId/favorites/remove", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const userId = req.params.userId;
        const movieId = req.body.movieId;

        if (req.user.id !== userId) {
            return res.status(403).send("You can only manage your own favorites.");
        }

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

// DELETE USER BY ID
app.delete("/users/:userId/delete", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const userId = req.params.userId;

        if (req.user.id !== userId) {
            return res.status(403).send("You can only delete your own account.");
        }

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

// MIDDLEWARE
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something broke!");
});

// SERVER LISTENING
server.listen(port, () => {
    console.log(`Your app is listening on port ${port}.`);
});
