const asyncHandler = require("express-async-handler");
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const User = require("../models/user.js");
const sdk = require('api')('@msg91api/v5.0#6n91xmlhu4pcnz');

const generateToken = (user) => {
    return jwt.sign({ user: user.phoneNumber }, "shhh secret",);
};

const registerUser = asyncHandler(async (req, res) => {
    const { phoneNumber, username, age, gender, language, ip_address, location, region, password } = req.body;

    try {
        const user = await User.findOne({ phoneNumber }).exec();
        if (user) {
            return res.status(408).json({ message: "User already exists" });
        } else {
            const hash = await bcrypt.hash(password, 10);
            const newUser = new User({
                phoneNumber,
                username,
                age,
                gender,
                language,
                ip_address,
                location,
                region,
                password: hash,
            });
            await newUser.save();

            return res.status(201).json({
                data: {
                    phoneNumber: newUser.phoneNumber,
                    token: generateToken(newUser),
                },
                message: "User created successfully",
            })
        }
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

const userSettings = asyncHandler(async (req, res) => {
    const user = req.userData.user;
    const { language, notificationsEnabled } = req.body;

    await User.findOneAndUpdate({ phoneNumber: user }, { language, notificationsEnabled }).then((foundUser) => {
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        else {
            res.status(201).json({ message: "Setting updated successfully" });
        }
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });
})

const getEditCount = asyncHandler(async (req, res) => {
    const user = req.userData.user;

    await User.findOne({ phoneNumber: user }).then((foundUser) => {
        res.status(201).json({ editCount: foundUser.editCount });
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });
})

const decrementEditCount = asyncHandler(async (req, res) => {
    const user = req.userData.user;
    const { decrementValue } = req.body;
    await User.findOneAndUpdate({ phoneNumber: user }, { $inc: { editCount: -decrementValue } },
        { new: true }).then((foundUser) => {
            res.status(201).json({ editCount: foundUser.editCount });
        }).catch((err) => {
            res.status(400).json({ message: err.message });
        });
})
const updateEditCount = asyncHandler(async (req, res) => {
    const { incrementValue } = req.body;
    const user = req.userData.user;
    await User.findOneAndUpdate({ phoneNumber: user }, { $inc: { editCount: incrementValue } },
        { new: true }).then((foundUser) => {
            res.status(201).json({ editCount: foundUser.editCount });
        }).catch((err) => {
            res.status(400).json({ message: err.message });
        });
})

const getUserDetails = asyncHandler(async (req, res) => {
    const user = req.userData.user;

    await User.findOne({ phoneNumber: user }).then((foundUser) => {
        res.status(201).json(foundUser);
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });

})

const sendOtp = asyncHandler(async (req, res) => {
    sdk.auth('406611Tj5sg0N5D6511529cP1');
    sdk.sendotp({
    }, { mobile: '7254880990', template_id: '3369796a6353383033323531' })
        .then(({ data }) => console.log(data))
        .catch(err => console.error(err));
})

const verifyOtp = asyncHandler(async (req, res) => {
    sdk.auth('406611Tj5sg0N5D6511529cP1');
    sdk.sendotp({
    }, { mobile: '7254880990', template_id: '3369796a6353383033323531' })
        .then(({ data }) => console.log(data))
        .catch(err => console.error(err));
})

const resendOtp = asyncHandler(async (req, res) => {
    sdk.auth('406611Tj5sg0N5D6511529cP1');
    sdk.sendotp({
    }, { mobile: '7254880990', template_id: '3369796a6353383033323531' })
        .then(({ data }) => console.log(data))
        .catch(err => console.error(err));
})


module.exports = { registerUser, loginUser, verifyUser, userSettings, getEditCount, updateEditCount, decrementEditCount, getUserDetails, resendOtp, verifyOtp, sendOtp };