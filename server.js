var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');
var middleware = require('./middleware.js')(db);
var userService = require('./routes/user_service.js');
var app = express();
var PORT = process.env.PORT || 3000;


app.use(bodyParser.json());

// All user method 

app.post('/user',userService.addUser); // Add New User
app.post('/user/login',userService.login); // Login User
app.post('/user/update',middleware.requireAuthentication,userService.update); // Update user details
app.delete('/user/login',middleware.requireAuthentication,userService.logout); // logout




module.exports =app;
 
 
db.sequelize.sync({force: true}).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});