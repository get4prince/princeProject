var bcrypt = require('bcrypt');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
        
           firstName:{
            type:DataTypes.STRING,
            allowNull:false,       
            },
        
           lastName:{
            type:DataTypes.STRING
            },
            
            mobileNumber: {
				type:DataTypes.INTEGER,
				allowNull : false,
				unique : true,
				validate : {
					notEmpty : true
				}
			},

           gender:{
              allowNull : false,
              type:DataTypes.STRING
            },

		   houseNo:{
			   type : DataTypes.STRING
		   },

		   street:{
			   type : DataTypes.STRING
		   },

		   city:{
			   type : DataTypes.STRING
		   },

		   state:{
			   type : DataTypes.STRING
		   },

		   pinCode:{
			   type : DataTypes.INTEGER
		   },

		   alternateContactNumber:{
			   type:DataTypes.INTEGER
		   },

		   dob : {
			   type : DataTypes.STRING
		   },

		   profilePicture : {
			   type : DataTypes.STRING
		   },

		   lat : {
			   type : DataTypes.STRING
		   },

		   lng : {
			   type : DataTypes.STRING
		   },

		   fcmToken : {
			   type : DataTypes.STRING
		   },

		   lastBloodDonate : {
			   type : DataTypes.STRING
		   },

		   bloodGroup : {
			   type : DataTypes.STRING
		   },

		   userPoints : {
			   type : DataTypes.INTEGER
		   },

    	salt: {
			type: DataTypes.STRING
		}
		// ,
		// password_hash: {
		// 	type: DataTypes.STRING
		// },
        
        
		// password: {
		// 	type: DataTypes.VIRTUAL,
		// 	allowNull: false,
		// 	validate: {
		// 		len: [7, 100]
		// 	},
		// 	set: function(value) {
		// 		var salt = bcrypt.genSaltSync(10);
		// 		var hashedPassword = bcrypt.hashSync(value, salt);

		// 		this.setDataValue('password', value);
		// 		this.setDataValue('salt', salt);
		// 		this.setDataValue('password_hash', hashedPassword);
		// 	}
		// }
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				// user.email
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		},
		classMethods: {
			authenticate: function(body) {
				return new Promise(function(resolve, reject) {
					if (typeof body.email !== 'string' || typeof body.password !== 'string') {
						return reject();
					}

					user.findOne({
						where: {
							email: body.email
						}
					}).then(function(user) {
						if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
							return reject();
						}

						resolve(user);
					}, function(e) {
						reject();
					});
				});
			},
			findByToken: function(token) {
				return new Promise(function(resolve, reject) {
					try {
						var decodedJWT = jwt.verify(token, 'qwerty098');
						var bytes = cryptojs.AES.decrypt(decodedJWT.token, 'abc123!@#!');
						var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

						user.findById(tokenData.id).then(function (user) {
							if (user) {
								resolve(user);
							} else {
								reject();
							}
						}, function (e) {
							reject();
						});
					} catch (e) {
						reject();
					}
				});
			}
		},
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json,'email','firstName','lastName','mobileNumber',
	 							   'gender','houseNo','street','city','state','pinCode','alternateContactNumber',
	 							   'dob','profilePicture','lat','lng','fcmToken','lastBloodDonate','bloodGroup',
	 							   'userPoints');
			},
			generateToken: function(type) {
				if (!_.isString(type)) {
					return undefined;
				}

				try {
					var stringData = JSON.stringify({
						id: this.get('id'),
						type: type
					});
					var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@#!').toString();
					var token = jwt.sign({
						token: encryptedData
					}, 'qwerty098');

					return token;
				} catch (e) {
					console.error(e);
					return undefined;
				}
			}
		}
	});

	return user;
};