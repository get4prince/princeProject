var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('../db.js');
var bcrypt = require('bcrypt');
var middleware = require('../middleware.js')(db);

var user = {
    addUser:function(req, res) {
     var body = _.pick(req.body , 'email','firstName','lastName','mobileNumber',
	 'gender','houseNo','street','city','state','pinCode','alternateContactNumber',
	 'dob','profilePicture','lat','lng','fcmToken','lastBloodDonate','bloodGroup',
	 'userPoints' );
     
    if(!body.hasOwnProperty('email')){
        body.email = '';
    }
    if(!body.hasOwnProperty('firstName')){
        body.firstName ='';
    }
    if(!body.hasOwnProperty('lastName')){
        body.lastName='';
    }
	if(!body.hasOwnProperty('mobileNumber')){
        body.mobileNumber='';
    }
	if(!body.hasOwnProperty('gender')){
        body.gender='';
    }
	if(!body.hasOwnProperty('houseNo')){
        body.houseNo='';
    }
	if(!body.hasOwnProperty('street')){
        body.street='';
    }
	if(!body.hasOwnProperty('city')){
        body.city='';
    }
	if(!body.hasOwnProperty('state')){
        body.state='';
    }
	if(!body.hasOwnProperty('pinCode')){
        body.pinCode='';
    }
	if(!body.hasOwnProperty('alternateContactNumber')){
        body.alternateContactNumber='';
    }
	if(!body.hasOwnProperty('dob')){
        body.dob='';
    }
	if(!body.hasOwnProperty('profilePicture')){
        body.profilePicture='';
    }
	if(!body.hasOwnProperty('lat')){
        body.lat='';
    }
	if(!body.hasOwnProperty('lng')){
        body.lng='';
    }
	if(!body.hasOwnProperty('fcmToken')){
        body.fcmToken='';
    }
	if(!body.hasOwnProperty('lastBloodDonate')){
        body.lastBloodDonate='';
    }
	if(!body.hasOwnProperty('bloodGroup')){
        body.bloodGroup='';
    }
	if(!body.hasOwnProperty('userPoints')){
        body.device_id='';
    }

    db.user.create(body).then(function (user) {
		var token = user.generateToken('authentication');
		userInstance = user;

		return db.token.create({
			token: token
		});
	}).then(function (tokenInstance) {
		res.header('Auth', tokenInstance.get('token')).json(userInstance.toJSON());
			
	}).catch(function (e) {
		console.log(e);
		res.status(401).send();
	});
          
 }, //addUser ends
    
// Login User starts
     login:function (req, res) {
	var body = _.pick(req.body, 'email', 'password');
	var userInstance;

	db.user.authenticate(body).then(function (user) {
		var token = user.generateToken('authentication');
		userInstance = user;

		return db.token.create({
			token: token
		});
	}).then(function (tokenInstance) {
		res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
	}).catch(function () {
		res.status(401).send();
	});
 },

 update:function(req,res){
     var body  = _.pick(req.body,'id','email','contact_no','fname','lname','gender','device_id','isActive');
     var attributes = {};


	if (body.hasOwnProperty('email')) {
		attributes.email = body.email;
	}if (body.hasOwnProperty('fname')) {
		attributes.fname = body.fname;
	}if (body.hasOwnProperty('lname')) {
		attributes.lname = body.lname;
	}if (body.hasOwnProperty('gender')) {
		attributes.gender = body.gender;
	}if (body.hasOwnProperty('contact_no')) {
		attributes.contact_no = body.contact_no;
	}if (body.hasOwnProperty('device_id')) {
		attributes.device_id = body.device_id;
	}if (body.hasOwnProperty('isActive')) {
		attributes.isActive = body.isActive;
	}
    
    db.user.findOne({
		where: {
			id: body.id
			
		}
	}).then(function(user) {
		if (user) {
			user.update(attributes).then(function(user) {
				res.json(user.toPublicJSON());
			}, function(e) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function() {
		res.status(500).send();
	});
 },
 
 logout:function (req, res) {
	req.token.destroy().then(function () {
		res.status(204).send();
	}).catch(function () {
		res.status(500).send();
	});
 } // log out end here
}
 
 module.exports =user;