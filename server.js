//Kaushik Dontula
//CS290
//June 6th

//initializing libraries
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

// Added middleware
const moment = require("moment");
moment().format();
const cors = require("cors");

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

// Create a new song
app.post("/", function (req, res) {
  let newSong = new Song({
    title: req.body.title,
    artist: req.body.artist,
    dateReleased: req.body.dateReleased,
    popularity: req.body.popularity,
    genre: req.body.genre,
  });
  newSong.save();
  res.redirect("/");
});

// Retrieve all songs
app.get("/api/songs", function (req, res) {
  Song.find({})
    .then(songs => {
      res.json(songs);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error cannot get songs from database");
    });
});

// Delete a song
app.delete("/api/songs/:id", function (req, res) {
  const songId = req.params.id;
  Song.findByIdAndDelete(songId)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error cannot delete song from database.");
    });
});

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Retrieve songs by genre
app.get("/api/songs/:genre", function (req, res) {
  const genre = req.params.genre;
  Song.find({ genre: genre })
    .then(songs => {
      res.json(songs);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error getting songs from selected genre.");
    });
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://dontulak:skydiveE2024@cluster0.vaw9ykx.mongodb.net/music_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create data schema
const songSchema = {
  title: String,
  artist: String,
  dateReleased: Date,
  popularity: Number,
  genre: String,
};

// Create a Song model
const Song = mongoose.model("Song", songSchema);

// Start the server
app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
