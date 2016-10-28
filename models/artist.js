var mongoose = require("mongoose");

//album schema 
var artistSchema = new mongoose.Schema({
    name: String,
    spotifyId: String,
    artistPhoto: String,
    albums: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Album"
         }   
    ],
});

module.exports = mongoose.model("Artist", artistSchema);