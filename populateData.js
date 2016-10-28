var request     = require("request");
    Album       = require('./models/album.js'),
    Artist      = require('./models/artist.js'),
    moment      = require('moment');

function populateData (query, callback) {
    
    var artistID = String;
    
    runSearchQuery();
    
    function runSearchQuery() {
    
        console.log("QUERY: " + query)
        
        var options = { method: 'GET',
          url: 'https://api.spotify.com/v1/search',
          qs: { q: query, type: 'artist' },
          headers: 
           { 'postman-token': 'f183a1a1-ed78-349f-14c1-637a4a2917d8',
             'cache-control': 'no-cache' } };
        
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
        
          var obj = JSON.parse(body);
          var topArtistResult = obj.artists.items[0].id;
          artistID = topArtistResult;
          runArtistAPI();
        });
    }
    
    function runArtistAPI() {
        var options = { method: 'GET',
          url: 'https://api.spotify.com/v1/artists/' + artistID + '/',
          headers: 
           { 'postman-token': 'b2ae8751-48a1-a1a9-85cd-54422f84ded7',
             'cache-control': 'no-cache' } };
        
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
            
            var obj = JSON.parse(body);
        
            console.log("artist api finished")
        
            addOrFindArtist(obj);
            
        }); 
    }
    
    function addOrFindArtist(artistAPI) {
        
        Artist.create({
            name: artistAPI.name,
            spotifyId: artistAPI.id,
            artistPhoto: artistAPI.images[0].url
        }, function(err, newArtist) {
            console.log("NEW ARTIST " + newArtist);
            runAlbumsAPI(newArtist);
        });
    }
    
    function runAlbumsAPI(artist) {
        
       var options = { method: 'GET',
          url: 'https://api.spotify.com/v1/artists/'+ artist.spotifyId +'/albums',
          qs: { limit: '20' },
          headers: 
           { 'postman-token': '5c741163-aaa2-e979-4a3c-f1c91aa1abc3',
             'cache-control': 'no-cache' } };
        
        request(options, function (err, response, body) {
            if (err) return callback(err);
        
            var albums = JSON.parse(body);
            apiResponse(artist, albums);
          
        });
        
    }
    
    function apiResponse(artist, albums) {
        
        var count = 0;
        var albumIds = [];
        
        albums.items.forEach(function(album) {
            
            albumIds.push(album.id);
            
            Album.create({
                spotifyId: album.id,
                albumName: album.name,
                trackType: album.type,
                albumArt:  getAlbumArt(),
                artist:    artist
            }, function(err, newAlbum) {
                
                if(err) return callback(err);
                artist.albums.push(newAlbum);
                count++;
                
                if(count == albums.items.length) {
                    console.log("SAVING ARTIST");
                    artist.save();
                    getTracks(albumIds);
                }
                
            });
            
            function getAlbumArt() {
                
                var albumArt = String;

                if(album.images.length == 0) {
                    albumArt = "http://www.bobjames.com/wp-content/themes/soundcheck/images/default-album-artwork.png";
                } else {
                    albumArt = album.images[0].url
                }
                
                return albumArt;
            }
        });
    };
    
    function getTracks(albums) {
        
        var options = { method: 'GET',
          url: 'https://api.spotify.com/v1/albums',
          qs: { ids: albums.join(',') },
          headers: 
          { 'postman-token': 'cd887392-1b09-2673-6881-f2b6c8989892',
             'cache-control': 'no-cache' } };
        
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
        
          var obj = JSON.parse(body);
          
          
          addTracksToAlbum(obj.albums);
          
        });
    };
    
    function addTracksToAlbum(albums) {
        
        var count = 0;
        
        albums.forEach(function(album) {
            
            Album.findOne({'spotifyId' : album.id }, function(err, foundAlbum) {
                
                if(err) return callback(err);
                
                album.tracks.items.forEach(function(track, index) {

                    foundAlbum.tracks.push(
                        {
                            name: track.name,
                            order: track.track_number,
                            duration: moment(track.duration_ms, "x").format("m:ss")
                        });
                    
                });
               
               foundAlbum.save();
               count++;
               
               if(count == albums.length) {
                   
                   console.log("DONE");
                   callback(null, true);
                   
               };
            });
        });
    };
};

module.exports = populateData;

