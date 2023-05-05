const User = require('../models/user.model')
const Post = require('../models/post.model.js')

exports.getAllPosts = async (req, res) => {
    const { _page, _limit } = req.query;

    const user = await User.findOne({ email: req.email, status: true });
    if (!user) {
        return res.status(404).send({
            message: 'No user found'
        })
    }

    const limit = Number(_limit ? _limit : 10);
    const skip = Number(_page * limit);

    const posts = await Post.aggregate([
        {
            $facet: {
                data: [
                    { $skip: skip },
                    { $limit:limit }
                ],
                totalCount: [
                    { $count: "count" }
                ]
            }
        }
    ])
    if (!posts) {
        return res.status(401).send({
            message: 'Somthing went wrong, try again later!'
        })
    }

    return res.status(200).send({
        message: "All posts",
        data: posts
    });
}

exports.getSpecificPost = async (req, res) => {
    const { postID } = req.params;
    const user = await User.findOne({ email: req.email, status: true });
    if (!user) {
        return res.status(404).send({
            message: 'No user found'
        })
    }
    let posts = await Post.findOne({ postID });
    if (!posts) {
        return res.status(401).send({
            message: 'Somthing went wrong, try again later!'
        })
    }
    return res.status(200).send({
        message: "Success",
        data: posts
    });
}

exports.getUserAllPosts = async (req, res) => {
    const { _page, _limit } = req.query;
    const user = await User.findOne({ email: req.email, status: true });
    if (!user) {
        return res.status(404).send({
            message: 'No user found'
        })
    }

    const limit = Number(_limit ? _limit : 10);
    const skip = Number(_page * limit);

    const posts = await Post.aggregate([
        { $match: {  userMail: req.email } },
        {
            $facet: {
                data: [
                    { $skip: skip },
                    { $limit:limit }
                ],
                totalCount: [
                    { $count: "count" }
                ]
            }
        }
    ])
    
    if (!posts) {
        return res.status(401).send({
            message: 'Somthing went wrong, try again later!'
        })
    }
    return res.status(200).send({
        message: "All posts",
        data: posts
    });
}

exports.createPost = async (req, res) => {
    const user = await User.findOne({ email: req.email, status: true });
    if (!user) {
        return res.status(404).send({
            message: 'No user found'
        })
    }
    if (req.body.topic === 'jobpost') {
        if (!req.body.noOfVacancy) {
            return res.status(401).send({
                message: 'Must provide no. of vacancy'
            })
        }
    }

    const post = new Post(req.body);
    post.user = user;

    const create_post = await post.save()
    if (!create_post) {
        return res.status(401).send({
            message: 'Something went wrong try again later!'
        })
    }
    return res.status(200).send({
        message: "Post successfully created",
        data: create_post
    });
}

exports.updatePost = async (req, res) => {
    const { body } = req
    const { postID } = req.params;

    const user = await User.findOne({ email: req.email, status: true });
    if (!user) {
        return res.status(404).send({
            message: 'No user found'
        })
    }

    const post = await Post.findOneAndUpdate({ postID, userMail: req.email }, {
        $set: { ...body },
    }, { new: true })

    if (!post) {
        return res.status(401).send({
            message: 'Somthing went wrong, try again later!'
        })
    }

    return res.status(200).send({
        message: "Post successfully updated!",
        data: post
    });
}

exports.deletePost = async (req, res) => {
    const { postID } = req.params;
    const user = await User.findOne({ email: req.email, status: true });
    if (!user) {
        return res.status(404).send({
            message: 'No user found'
        })
    }

    const post = await Post.findOneAndDelete({ postID, userMail: req.email })
    if (!post) {
        return res.status(401).send({
            message: 'Somthing went wrong, try again later!'
        })
    }
    return res.status(200).send({
        message: "Post successfully deleted!",
    });
}

exports.getAllTopics = async (req, res) => {
    const user = await User.findOne({ email: req.email, status: true });
    if (!user) {
        return res.status(404).send({
            message: 'No user found'
        })
    }
    const posts = await Post.find({});
    if (!posts) {
        return res.status(401).send({
            message: 'Somthing went wrong, try again later!'
        })
    }
    const topics = [];
    posts.map(data => {
        topics.push(data.topic);
    })

    return res.status(200).send({
        message: "All posts",
        data: topics
    });
}

exports.getPostsSpecificTopic = async (req, res) => {
    const { _page, _limit } = req.query;
    const { topic } = req.params;
    const user = await User.findOne({ email: req.email, status: true });
    if (!user) {
        return res.status(404).send({
            message: 'No user found'
        })
    }

    const limit = Number(_limit ? _limit : 10);
    const skip = Number(_page * limit);

    const posts = await Post.aggregate([
        { $match: { topic } },
        {
            $facet: {
                data: [
                    { $skip: skip },
                    { $limit:limit }
                ],
                totalCount: [
                    { $count: "count" }
                ]
            }
        }
    ])

    if (!posts) {
        return res.status(401).send({
            message: 'Somthing went wrong, try again later!'
        })
    }
    return res.status(200).send({
        message: `All posts of ${topic}`,
        data: posts
    });
}

exports.postReact = async (req, res) => {
    const { postID } = req.params;
    const user = await User.findOne({ email: req.email, status: true });
    if (!user) {
        return res.status(404).send({
            message: 'No user found'
        })
    }

    const posts = await Post.findOneAndUpdate({ postID }, {
        $addToSet: { reacts: req.email },
    }, { new: true });

    if (!posts) {
        return res.status(401).send({
            message: 'Somthing went wrong, try again later!'
        })
    }
    return res.status(200).send({
        message: "Post react success",
        data: posts
    });
}

exports.postComment = async (req, res) => {
    const { postID } = req.params;
    const user = await User.findOne({ email: req.email, status: true });
    if (!user) {
        return res.status(404).send({
            message: 'No user found'
        })
    }

    const posts = await Post.findOneAndUpdate({ postID }, {
        $push: {
            comments: {
                description: req.body.description,
                userID: user.userID,
                email: user.email,
                picture: user?.picture,
                fullname: user.fullname
            }
        },
    }, { new: true });

    if (!posts) {
        return res.status(401).send({
            message: 'Somthing went wrong, try again later!'
        })
    }
    return res.status(200).send({
        message: "Post comment success",
        data: posts
    });
}

exports.topReactedPost = async (req, res) => {
    const user = await User.findOne({ email: req.email, status: true });
    if (!user) {
        return res.status(404).send({
            message: 'No user found'
        })
    }

    const posts = await Post.aggregate([
        {
            $project: {
                reacts: 1,
                title: 1,
                description: 1,
                user: 1,
                postID: 1,
                arrayLength: { $size: "$reacts" }
            }
        },
        {
            $sort: { arrayLength: -1 }
        },
        {
            $limit: 3
        }
    ]);

    if (!posts) {
        return res.status(401).send({
            message: 'Somthing went wrong, try again later!'
        })
    }
    return res.status(200).send({
        message: "Top reacted posts",
        data: posts
    });
}