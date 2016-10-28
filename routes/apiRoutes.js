//variable declarations
var express         = require('express'),
    router          = new express.Router(),
    Album           = require('../models/album.js');


//all albums api
router.get("/albums",function(req, res) {
   
   Album.find({})
   .sort({'albumName' : 1})
   .select('albumName trackType tracks artist')
   .populate('tracks artist')
   .exec(function(err, allAlbums) {
      
      if(err) return err;
      
      var json = JSON.stringify({ 
        // anObject: otherObject, 
        albums: allAlbums, 
        // another: "item"
      });

      res.end(json);
       
   });
});

module.exports = router;