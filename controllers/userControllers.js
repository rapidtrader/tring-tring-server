const asyncHandler = require("express-async-handler");
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const User = require("../models/usersModel.js");

const generateToken = (user) => {
    return jwt.sign({ user: user.phoneNumber }, "shhh secret", {
        expiresIn: "60min",
    });
};

const registerUser = asyncHandler(async (req, res) => {
    const { phoneNumber, region, language, password } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({
            phoneNumber,
            region,
            language,
            password: hash,
        });
        await newUser.save();

        res.status(201).json({
            phoneNumber: newUser.phoneNumber,
            token: generateToken(newUser),
        })
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { phoneNumber, password } = req.body;

    try {
        const foundUser = await User.findOne({ phoneNumber });
        const hash = foundUser.password;
        bcrypt.compare(password, hash, (err, result) => {
            if (err) throw err;
            else {
                if (result) {
                    res.status(200).json({
                        data: {
                            phoneNumber: foundUser.phoneNumber,
                            token: generateToken(foundUser),
                        },
                        message: "Login successful",
                    });
                } else {
                    res.status(401).json({
                        data: {},
                        message: "Invalid credentials"
                    });
                }
            }
        });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

const verifyUser = asyncHandler(async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        var decoded = jwt.verify(token, "shhh secret");
        req.userData = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized Access" });
    }
});

module.exports = { registerUser, loginUser, verifyUser };