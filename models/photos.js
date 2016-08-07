// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var User = require('./user')
// Will add the Currency type to the Mongoose Schema types
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;


var photoSchema = new Schema({
    image:{
        type: String,
        
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

},
    
    
{
    timestamps: true
});


//need to create a model
var Photo = mongoose.model('Photo', photoSchema);

// make this available to our Node applications
module.exports = Photo;