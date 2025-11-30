const mongoose = require('mongoose');
const { Gender, Status } = require('../../config/constant');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        min: 2,
        max: 50,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    gender: {
        type: String,
        enum: Object.values(Gender)
    },

    image: {
        public_id: String,
        url: String,
        optimizedUrl: String,
    },

    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.INACTIVE
    },

    address: String,
    phone_no: String,
    dob: Date,
    activationToken: String,
    forget_Password: String,
    expiry_date: Date
    
}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true
})


const userModel = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = userModel;