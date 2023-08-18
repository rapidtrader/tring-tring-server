const asyncHandler = require("express-async-handler");
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel.js");

const registerUser = asyncHandler(async (req, res) => {
    const { phoneNumber, region, language, password } = req.body;

    const user = {
        phoneNumber,
        region,
        language,
        password,
    };

    await User.create(user).then((user) => {
        res.status(201).json({ message: "User created successfully" });
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { phoneNumber, password } = req.body;

    User.findOne({ phoneNumber }).then((user) => {
        if (user.password === password) {
            const token = generateToken(user.phoneNumber);
            res.status(200).json({ phoneNumber, token });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });
});

function generateToken(phoneNumber) {
    return jwt.sign({ phoneNumber }, "shhh secret", {
        expiresIn: "60min",
    });
}

function verifyToken(req) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        var decoded = jwt.verify(token, "shhh secret");
        return true;
    } catch (error) {
        return false
    }
}

const verifyUser = asyncHandler(async (req, res) => {
    verifyToken(req) ? res.status(200).json({}) : res.status(401).json({});

});

module.exports = {registerUser, loginUser, verifyUser };