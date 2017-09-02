module.exports = function(sequelize , DataTypes){

    return sequelize.define('request' , {

        userId : {

            type : DataTypes.INTEGER
        },

        name : {
            type : DataTypes.STRING
        },

        dateOfRequest : {
            type : DataTypes.STRING
        },

        address : {
            type : DataTypes.STRING
        },

        location : {
            type : DataTypes.STRING
        },

        urgent : {
            type : DataTypes.INTEGER
        },

        bloodGroup : {
            type : DataTypes.STRING
        },

        contactNumber : {
            type : DataTypes.INTEGER
        },

        alternateContactNumber : {
            type : DataTypes.INTEGER
        },

        unit : {
            type : DataTypes.INTEGER
        },

        bloodRequiredOn : {
            type : DataTypes.STRING
        }
        
    });
}