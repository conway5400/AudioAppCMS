var mongoose = require("mongoose");

//album schema 
var albumSchema = new mongoose.Schema({
    albumName: String,
    artist: 
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Artist"
         },
    trackType: String,
    albumArt: String,
    spotifyId: String,
    tracks:
    [
        {
            name: String,
            order: Number,
            fileLink: String,
            duration: String
        }
    ]
});

module.exports = mongoose.model("Album", albumSchema);