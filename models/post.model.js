const mongoose = require("mongoose");
const uniqid = require('uniqid');

const PostSchema = new mongoose.Schema({
    postID: {
        type: String,
        required: true,
        unique: true,
        default: () => uniqid("data")
    },
    user: {
        type: Object,
        required: true,
    },
    title: {
        type: String,
        required:true
    },
    topic:{
        type: String,
        required:true
    },
    description: {
        type: String,
        required:true
    },
    picture:{
        type: String,
    },
    noOfVacancy:{
        type:Number,
    },
    reacts:[],
    comments:[],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

//Creating index  on the basis of some field;
PostSchema.index({ postID: 1,topic:1,userMail:1 });

//Setting some field not to send in response
PostSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Post = mongoose.model('post', PostSchema)
module.exports = Post;