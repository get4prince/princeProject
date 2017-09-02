var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + '/data/bePositive.sqlite'
	});
}

var db = {};


db.user = sequelize.import(__dirname + '/models/user.js');
db.token = sequelize.import(__dirname + '/models/token.js');
db.request = sequelize.import(__dirname + '/models/request.js');
db.donationRequest = sequelize.import(__dirname + '/models/donationRequest.js');

db.request.hasMany(db.donationRequest);
db.sequelize = sequelize;
db.Sequelize = Sequelize;



module.exports = db;