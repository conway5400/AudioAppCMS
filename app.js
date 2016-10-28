//declare variables
var mongoose        =   require("mongoose"),
    express         =   require("express"),
    bodyParser      =   require("body-parser"),
    methodOverride  =   require("method-override"),
    // fileUpload   =   require('express-fileupload'),
    app             =   express(),
    populateData    =   require('./populateData.js'),
    clearAllData    =   require('./clearAllData.js'),
    conn            =   require('./mongoLab.js'),

//route variables    
    albumRoutes     = require("./routes/albumRoutes"),
    apiRoutes       = require("./routes/apiRoutes"),
    artistRoutes    = require("./routes/artistRoutes"),
    searchRoutes    = require("./routes/searchRoutes");
    
conn.on('error', console.error.bind(console, 'connection error:'));  
 
conn.once('open', function() {
  console.log("connection success!");                         
});

//app parameters
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));    
// app.use(fileUpload());

//connect to database
mongoose.connect("mongodb://localhost/audioapp");

//routes
app.use('/albums', albumRoutes);
app.use('/api', apiRoutes);
app.use('/search', searchRoutes);
app.use('/artists', artistRoutes);

//Landing route to index
app.get("/", function(req, res){
    res.redirect('/albums');
});

//Landing route to index
app.get("/clearAllData", function(req, res){
    clearAllData(function(err, done) {
       if(err) return callback(err);
       res.redirect('/'); 
    });
});


//server listen
app.listen((process.env.PORT || 8080), function() {
  console.log('I\'m Listening to audio app cms on 8080...');
});