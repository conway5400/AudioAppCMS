var express         = require('express'),
    router          = new express.Router(),
    Album           = require('../models/album.js');


//album INDEX
router.get("/", function(req, res){
    
    console.log("all albums")
    
    Album.find({})
       .sort({'albumName' : 1})
       .populate('artist tracks')
       .exec(function(err, allAlbums) {
            if(err) return err;
            res.render('../views/albums/allAlbums', {albums: allAlbums});
        });
});

//album INDEX
router.get("/:id", function(req, res){
    
    Album.findById(req.params.id)
       .populate('artist tracks')
       .exec(function(err, foundAlbum) {
            if(err) return err;
            res.render('../views/albums/showAlbum', {album: foundAlbum});
        });
});

//album POST new album
router.post("/", function(req, res){

    Album.create({
        albumName: req.body.albumTitle,
        trackType: req.body.trackType
    }, function(err, newAlbum) {
        
        if(err) return err;
        
        console.log("New Album: " + newAlbum);
    });
});

module.exports = router;