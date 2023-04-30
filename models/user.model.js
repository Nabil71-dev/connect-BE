const mongoose = require("mongoose");
const uniqid = require('uniqid');

const UserSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true,
        default: () => uniqid("data")
    },
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    picture: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true
    },
    company: {
        name: {
            type: String
        },
        designation: {
            type: String
        },
        workingPlace: {
            type: String
        }
    },
    personalWrbUrl: {
        type: String,
    },
    personalDescription: {
        type: String,
    },
    workingStack: {
        type: String,
    },
    profileLinks: [],
    seekingJob:{
        type: Boolean,
        default: true
    }, 
    CV:{
        type: String,
    }
});

//Creating index  on the basis of some field;
UserSchema.index({ status: 1, email: 1, userID: 1, fullname:1 });

//Setting some field not to send in response
UserSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password;
    },
});


const User = mongoose.model('user', UserSchema)
module.exports = User;