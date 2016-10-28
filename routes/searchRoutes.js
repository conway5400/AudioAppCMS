var express         = require('express'),
    router          = new express.Router(),
    populateData    = require('../populateData.js');
    
router.post("/", function(req, res) {
   populateData(req.body.searchQuery, function(err, done) {
        if (err) return err;
        console.log("POPULATE DATA DONE");
        res.redirect('/'); 
   }); 
});
    
module.exports = router;