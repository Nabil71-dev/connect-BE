const express = require('express')
const cors = require('cors')
const { unless } = require("express-unless");
const bodyParser = require('body-parser')
require('dotenv').config();
const mongoose = require('mongoose')
const DbConfig = require('./config/DbConfig');
const auth = require('./middlewares/auth');
const { noAuthRoutes } = require("./utils/Constant");


const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: 1024 * 1024 * 10 }));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// DATABASE CONNECTION
try {
  mongoose.connect(DbConfig.db, { useNewUrlParser: true, useUnifiedTopology: true, })
  console.log("Success");
} catch (err) {
  console.log(`Database can't be connected: ${err}`);
}

//Skipping auth for routes that are in noAuthRoutes file
auth.authenticateToken.unless = unless;
app.use(
  auth.authenticateToken.unless({
    path: noAuthRoutes
  })
);

// initialize routes
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/post", require("./routes/post.routes"));

// middleware for error responses
//default error handler
app.use((err, req, res, next) => {
  res.status(500).send({
    "message": "There was a server side error!"
  })
})

app.listen(process.env.SERVER_PORT || 8080, () => {
  console.log("You are connected");
});