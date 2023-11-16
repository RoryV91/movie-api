const mongoose = require("mongoose");

let movieSchema = mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	imageurl: String,
	featured: { type: Boolean, required: true },
	genre: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" },
	actor_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Actor" }],
	release: { type: Date, required: true },
	director_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Director" }],
	genre_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
});

let directorSchema = mongoose.Schema({
	name: { type: String, required: true },
	bio: { type: String, required: true },
	birth: { type: Date, required: true },
	death: Date,
});

let genreSchema = mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
});

let actorSchema = mongoose.Schema({
    name: { type: String, required: true },
    bio: { type: String, required: true },
    birth: { type: Date, required: true },
    death: Date,
});

let userSchema = mongoose.Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true },
	dob: {type: Date, required: true },
	user_movie_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

let Movie = mongoose.model("Movie", movieSchema);
let Director = mongoose.model("Director", directorSchema);
let Genre = mongoose.model("Genre", genreSchema);
let Actor = mongoose.model("Actor", actorSchema);
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.Director = Director;
module.exports.Genre = Genre;
module.exports.Actor = Actor;
module.exports.User = User;
