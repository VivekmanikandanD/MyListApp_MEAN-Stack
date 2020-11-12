const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hashedpassword => {
    const user = new User({
      email: req.body.email,
      password: hashedpassword
    });
    user.save().then(result => {
      res.status(201).json({
        message: "User created successfully",
        result: result
      })
    })
      .catch(err => {
        res.status(500).json({
          message: "Invalid authentication credentials"
        });
      })
  });
}

exports.loginUser = (req, res, next) => {
  User.findOne({ email: req.body.email }).then(result => {
    if (!result) {
      return res.status(401).json({ message: "This email id does not exist in our database" })
    }
    bcrypt.compare(req.body.password, result.password).then(isvalid => {
      if (!isvalid) {
        return res.status(401).json({ message: "Please check your password" })
      }
      const token = jwt.sign(
        { email: result.email, userId: result._id }, process.env.JWT_KEY,
        { expiresIn: "1h" }
      )
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: result._id
      });
    });
  }).catch(err => {
    res.status(401).json({ message: "Authorization failed" })
  })
}
