var express         = require('express'),
    router          = new express.Router(),
    Artist           = require('../models/artist.js');


//album INDEX
router.get("/", function(req, res){
    
    console.log("all artists")
    
    Artist.find({}).exec(function(err, allArtists) {
            if(err) return err;
            res.render('../views/artists/allArtists', {artists: allArtists});
        });
});

//album INDEX
router.get("/:id", function(req, res){
    
    Artist.findById(req.params.id)
       .populate('albums')
       .exec(function(err, foundArtist) {
            if(err) return err;
            console.log(foundArtist);
            res.render('../views/artists/showArtist', {artist: foundArtist});
        });
});

//album POST new album
router.post("/", function(req, res){

    Artist.create({
        name: req.body.albumTitle,
        artistPhoto: req.body.trackType
    }, function(err, newArtist) {
        
        if(err) return err;
        
        console.log("New Artist: " + newArtist);
    });
});

module.exports = router;