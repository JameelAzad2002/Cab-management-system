const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cabSchema = new Schema({
    hall:{
        type: String,
        required:true        
    },
    time:{
        type:String,
        required:true
    },
    place:{
        type:String,
        required:true
    }
},{timestamps:true});

const Cab = mongoose.model('cab', cabSchema);
module.exports = Cab;

