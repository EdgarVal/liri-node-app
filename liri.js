//----------------global data-----------------------
require("dotenv").config();
const fs = require("fs");
const spotify = require("node-spotify-api");
const keys = require("./keys.js");
const request = require("request");
const moment = require("moment")

let input1 = process.argv[2];
let input2 = process.argv[3];
const defaultShow = "Vampire Weekend";
const defaultSong = "Bye Bye Bye";
const defaultMovie = "Mr. Nobody";

//--------------------------------------------------


//--------------command function--------------------
function processCommand (command, input2) {
    // console.log(input2);

    switch(command) {
        case "spotify-this-song":
            if(input2 === undefined) {
                input2 = defaultSong;
            }
            spotifySearch(input2);
        break;
        case "movie-this":
            if (input2 === undefined) {
                input2 = defaultMovie;
            }
            movieSearch(input2);
        break;
        case "concert-this":
            if (input2 === undefined) {
                input2 = defaultShow;
        }
            concertSearch();
        break;
        case "do-what-it-says":
            random();
        break;
        default:
            console.log("Invalid command.",
                        "\nHi, I'm Liri, let me see if I can help you!",
                        "\nI can help you get the information you need with any one of the following commands.",
                        "\n1-spotify-this-song ('song name')",
                        "\n2-movie-this ('movie name')",
                        "\n3-concert-this ('artist/band's name')",
                        "\n4-do-what-it-says (a default search)",
                        "\nFirst type 'node liri.js' then one of the '[commands]' to get started.",
                        "\nGo ahead & give one of these a try!");
    }
}
//---------------------------------------------------


//--------------spotify function----------------------
function spotifySearch() {
    const spot = new spotify(keys.spotify);
    let songName = input2;
    
    if(songName === undefined) {
        console.log("Please input the song you want to find in the right format.",
                    "\nMake sure your search is inside quotes. Ex: 'song name'.",
                    "\nHow about this song: " + defaultSong + "by N*sync.");
    } else {
            spot.search({ type: "track", query: songName}, function (err, data) {
                if (err) {
                    console.log("---------------------------\n" +
                                "Sorry, an error occurred: \n" + err +
                                "\nHow about you listen to Ace of Base instead? \nI recommend the song called: 'The Sign'");
                    spot.search({ type: "track", query: defaultSong}, function (err2, data2) {
                        if (!err2) {
                                    console.log(
                                    "\nArtist: " + data2.albums.items[0].artists[0].name,
                                    "\nAlbum: " + data2.albums.items[0].name,
                                    "\nSpotify URL: " + data2.albums.items[0].external_urls.spotify)
                                    }
                                });
                            return;
                        }console.log("---------------------------\n" + 
                                    "Song Name: " + data.tracks.items[0].name,
                                    "\nArtist: " + data.tracks.items[0].artists[0].name,
                                    "\nPreview Link: " + data.tracks.items[0].external_urls.spotify,
                                    "\nAlbum Name: " + data.tracks.items[0].album.name);
                                    // console.log(data.tracks.items[0]); // see the spotify object
                }); 
            } 
        };
//---------------------------------------------------


//----------------OMDB function----------------------
function movieSearch() {
    let movie = input2;
    if (movie === undefined) { //if no movie is searched, use Mr. Nobody from Netflix
        request("https://www.omdbapi.com/?t=Mr%20Nobody&y=&plot=short&apikey=trilogy", function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log("-------------------------\n" +
                            "No movie was added to the search \n" + 
                            "Make sure your serach is inside quotes. Ex: 'movie name'. \n" +
                            "I recommend Mr Nobody! Its on Netflix. \n",

                            "\nThe movie title is: " + JSON.parse(body).Title,
                            "\nMovie release date is: " + JSON.parse(body).Year,
                            "\nThe movie was made in: " + JSON.parse(body).Country,
                            "\nThe Rotten Tomatoes rating is: " + JSON.parse(body).Ratings[1].Value,
                            "\nThe IMDB movie rating is: " + JSON.parse(body).imdbRating,
                            "\nHere's the list of actors: \n" + JSON.parse(body).Actors + "\n" +
                            "\nThis is the movie's plot: \n" + JSON.parse(body).Plot 
                            );
            }
        });
    } else {
        request("https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
            if(!error && response.statusCode === 200) {
                if (JSON.parse(body).Response != "false") {
                    console.log (
                                "--------------------------\n" +
                                "Your movie search results: \n",
                                "\nThe movie title is: " + JSON.parse(body).Title,
                                "\nMovie release date is: " + JSON.parse(body).Year,
                                "\nThe movie was made in: " + JSON.parse(body).Country,
                                "\nThe Rotten Tomatoes rating is: " + JSON.parse(body).Ratings[1].Value,
                                "\nThe IMDB movie rating is: " + JSON.parse(body).imdbRating,
                                "\nHere's the list of actors: \n" + JSON.parse(body).Actors + "\n" +
                                "\nThis is the movie's plot: \n" + JSON.parse(body).Plot
                            );
                } else {
                    console.log("--------------------------\n");
                    console.log("Sorry, cant find the movie you're looking for. Try again!");
                }
            }
        });
    }
}
//---------------------------------------------------


//----------------bands function---------------------
function concertSearch() {
    let performer = input2;
    console.log("runs");
    if (performer) {
        request("https://rest.bandsintown.com/artists/" + performer + "/events?app_id=codingbootcamp", function (err, data) {
            let body = JSON.parse(data.body);
            if (err) {
                console.log("No show/artist was found with your search.",
                            "\nMake sure your search is inside quotes. Ex: 'artist/band's name'.",
                            "\nHow about looking up a show for " + defaultShow + "?");
            } else {
                    let time = body[0].datetime;
                    time = moment(time).format('MM/DD/YYYY');
                    console.log("--------------------------" + 
                                "\nYour concert/show search results: " +
                                "\nVenue Name: " + body[0].venue.name,
                                "\nVenue Location - Country: " + body[0].venue.country,
                                "\nVenue Location - City: " + body[0].venue.city,
                                "\nVenue Location - State: " + body[0].venue.region,
                                "\nShow Date: " + time); 
            }  
        })   
    }
}
//---------------------------------------------------


//----------------random function---------------------
function random() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
    console.log(data);
    let dataArr = data.split(",");
    processCommand(dataArr[0], dataArr[1]);
    })
}
processCommand(input1, input2);
//----------------------------------------------------