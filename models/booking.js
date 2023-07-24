const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    mob_num:{
        type: String,
        required: true
    },
    hall:{
        type:String,
        required: true
    },
    date:{
        type:String,
        required: true
    }
},{timestamps: true});

const Booking = mongoose.model('booking', bookingSchema);
module.exports = Booking;

