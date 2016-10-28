var Album       = require('./models/album.js'),
    Artist      = require('./models/artist.js');

function clearAllData(callback) {
    Album.remove({}, function(err){
        if(err) return err;
        console.log("albums removed");
    });    
    
    Artist.remove({}, function(err){
        if(err) return err;
        console.log("artists removed");
    });
    
    console.log("clear data done");
    
    callback(null, true);
}

module.exports = clearAllData;