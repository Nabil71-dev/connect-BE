const bcrypt = require('bcrypt');
const User = require('../models/user.model')
const { generateAccessToken, generateToken, resetPassToken } = require('../middlewares/auth');

exports.userLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, status: true });
    if (!user) {
        return res.status(404).send({
            message: 'No user found'
        })
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
        const token = generateToken(email)
        const accessToken = generateAccessToken(email)

        return res.status(200).send({
            message: "Login successful",
            data: {
                accessToken,
                token,
                expireTime: "600s",
            }
        });
    } else {
        return res.status(401).send({
            message: "Login error!"
        });
    }
}

exports.userSignup = async (req, res) => {
    const { email, password } = req.body;
    const olduser = await User.findOne({ email });
    if (olduser) {
        return res.status(401).send({
            message: 'Email already exist'
        })
    }

    const salt = bcrypt.genSaltSync(10);
    req.body.password = bcrypt.hashSync(password, salt);

    const user = new User(req.body);
    await user.save()
        .then((response) => {
            return res.status(200).send({
                message: "User creation Success",
                data: response
            });
        })
        .catch((error) => {
            return res.status(400).send({
                message: "Something went wrong",
                data: error
            });
        });
}

exports.getUserProfile = async (req, res) => {
    const user = await User.findOne({ email: req.email, status: true });
    if (!user) {
        return res.status(404).send({
            message: 'No user found'
        })
    }
    return res.status(200).send({
        message: "User found!",
        data: user
    });
}

exports.getSpecificUserProfile = async (req, res) => {
    const user = await User.findOne({ email: req.email, status: true });
    if (!user) {
        return res.status(404).send({
            message: 'No user found'
        })
    }

    const req_user = await User.findOne({ userID: req.params.userID });
    if (!req_user) {
        return res.status(404).send({
            message: 'No user found'
        })
    }
    return res.status(200).send({
        message: "User found!",
        data: req_user
    });
}

exports.updateUserProfile = async (req, res) => {
    const { body } = req
    const data = await User.findOneAndUpdate({ email: req.email, status: true }, {
        $set: { ...body },
    }, { new: true })
    if (data) {
        return res.status(200).send({
            message: "Update Success",
            data
        });
    }
    return res.status(401).send({
        message: "Error, Try again later!",
    });
}

exports.resetPassRequest = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email, status: true });
    if (!user) {
        return res.status(404).send({
            message: 'No user found'
        })
    }

    const resetToken = resetPassToken(email)
    return res.status(200).send({
        message: "User found!",
        data: {
            token: resetToken,
        }
    });
}

exports.resetPass = async (req, res) => {
    const { password } = req.body;

    const user = await User.findOne({ email: req.email, status: true });
    if (!user) {
        return res.status(404).send({
            message: 'No user found'
        })
    }

    const salt = bcrypt.genSaltSync(10);
    req.body.password = bcrypt.hashSync(password, salt);

    const data = await User.findOneAndUpdate({ email: req.email, status: true }, {
        $set: { password: req.body.password },
    }, { new: true })
    if (data) {
        return res.status(200).send({
            message: "Your password successfully reseted, now you can login",
        });
    }
    else {
        return res.status(401).send({
            message: "Error, Try again later!",
        });
    }
}

exports.refreshToken = async (req, res) => {
    const user = await User.findOne({ email: req.email, status: true });
    if (!user) {
        return res.status(404).send({
            message: 'No user found'
        })
    }

    const accessToken = generateAccessToken(req.email)
    return res.status(200).send({
        message: "New access token",
        data: {
            accessToken,
            expireTime: "600s",
        }
    });
}