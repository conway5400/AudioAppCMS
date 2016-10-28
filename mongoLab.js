var mongoose            =   require("mongoose");
var auth                =   require("./config/auth.js");

var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };       
 
var mongodbUri = 'mongodb://' 
                  + auth.mongooseAuth.username + ':' 
                  + auth.mongooseAuth.password + '@' 
                  + auth.mongooseAuth.databaseId + '.mlab.com:'
                  + auth.mongooseAuth.port + '/'
                  + auth.mongooseAuth.databaseName
 
console.log(mongodbUri);
 
mongoose.connect(mongodbUri, options);

var conn = mongoose.connection;             
 
module.exports = conn; 
