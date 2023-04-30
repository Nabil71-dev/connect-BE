const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const { authorization } = req.headers;
    try {
        const token = authorization && authorization.split(' ')[1];
        if (token == null) {
            return res.status(401).send({
                message:"Deniend!"
            });
        }

        const decoded = jwt.verify(token, `${process.env.TOKEN_SECRET}-RAS`)
        const { email } = decoded;
        req.email = email
        next();
    } catch(err) {
        return res.status(403).send({ message: "Access denied" });
    }
}

const generateToken = (mail) => {
    const token = jwt.sign({ email: mail }, `${process.env.TOKEN_SECRET}-RAS`, {
        expiresIn: '1h'
    })
    return token;
}

const generateAccessToken = (mail) => {
    const token = jwt.sign({ email: mail }, `${process.env.TOKEN_SECRET}-RAS`, {
        expiresIn: '20m'
    })
    return token;
}

const resetPassToken = (mail) => {
    const token = jwt.sign({ email: mail }, `${process.env.TOKEN_SECRET}-RAS`, {
        expiresIn: '5m'
    })
    return token;
}

module.exports = {
    authenticateToken,
    generateToken,
    generateAccessToken,
    resetPassToken
}