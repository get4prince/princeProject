module.exports = function(sequelize , DataTypes){

    return sequelize.define('donationRequest' , {

        requestedUser : {
            type : DataTypes.STRING
        },

        donor : {
            type : DataTypes.STRING
        },

        status : {
            type : DataTypes.STRING
        },

        donorContactNumber : {
            type : DataTypes.INTEGER
        }
        
    });
}