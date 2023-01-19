/**********************************************************************************
 *   WEB422 – Assignment 1
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 * Name: JIHYUN NAM Student ID: 130641210 Date: 19th JAN, 2023
 * 
 * Cyclic Link: 
 * 
 * ********************************************************************************/ 

const express = require("express");
const cors = require("cors");
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();      // to create a new "db" instance to work with the data

require("dotenv").config();
// console.log(">>>>> Debugging::MONGODB_CONN_STRING : " + process.env.MONGODB_CONN_STRING);

const app = express();
app.use(cors());
app.use(express.json());

const HTTP_PORT = process.env.PORT || 8080;

// ********** "Initializing" the Module before the server starts **********
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});

// ********** Add the API routes **********
// HTTP STATUS CODES
// 1. 201 : Created
// 2. 204 : Deleted
// 3. 500 : Internal Server Error(Catch-All) - Not a detailed error code

// POST /api/movies :  This route uses the body of the request to add a new "Movie" document to the collection and return the newly created movie object / fail message to the client.
app.post("/api/movies", (req,res) => {
    db.addNewMovie(req.body)
    .then((data) => {
        res.status(201).json(data);
    })
    .catch((err) => {
        res.status(500).json(err);
    });
});

// GET /api/movies, ie: /api/movies?page=1&perPage=5&title=The Avengers
app.get("/api/movies", (req, res)=> {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
    .then((movies) => {
        res.status(200).json(movies);
    })
    .catch((err) => {
        res.status(500).json(err);
    });
});

// GET /api/movies,  ie: /api/movies/63c01a043fbe38eb2967d99e
app.get("/api/movies/:id", (req, res)=> {
    db.getMovieById(req.params.id)
    .then((movies) => {
        res.status(200).json(movies);
    })
    .catch((err) => {
        res.status(500).json(err);
    });
});

// PUT /api/movies, ie: /api/movies/63c01a043fbe38eb2967d99e 
app.put("/api/movies/:id", (req, res)=> {
    db.updateMovieById(req.body, req.params.id)
    .then((data) => {
        res.status(200).json(data);
    })
    .catch((err) => {
        res.status(500).json(err);  
    });
});

// DELETE /api/movies, ie: /api/movies/573a1391f29313caabcd956e  <-- This id has been deleted to test.. Please input another id
app.delete("/api/movies/:id", (req, res)=> {
    db.deleteMovieById(req.params.id)
    .then(() => {
        res.status(204).json('Movie  deleted successfully!');       // or end();
    })
    .catch((err) => {
        res.status(500).json(err);
    });
});
