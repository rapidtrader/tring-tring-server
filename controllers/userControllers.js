const asyncHandler = require("express-async-handler");
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const User = require("../models/user.js");
const sdk = require('api')('@msg91api/v5.0#6n91xmlhu4pcnz');
const { UserDetail } = require("otpless-node-js-auth-sdk");

const generateToken = (user) => {
    return jwt.sign({ user: user.phoneNumber }, "shhh secret",);
};

function generateCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}

const registerUser = asyncHandler(async (req, res) => {
    const { phoneNumber, email, name, age, gender, language, ip_address, location, region, password, referralCode } = req.body;

    try {
        let uniqueCode = true;
        let myReferralCode = '';
        while (uniqueCode) {
            myReferralCode = generateCode();
            uniqueCode = await User.findOne({ myReferralCode }).exec();
        }
        const user = await User.findOne({ phoneNumber }).exec();
        if (user) {
            return res.status(408).json({ message: "User already exists" });
        } else {
            const hash = await bcrypt.hash(password, 10);
            const newUser = new User({
                phoneNumber,
                name,
                age,
                email,
                gender,
                language,
                ip_address,
                location,
                region,
                password: hash,
                myReferralCode
            });
            await newUser.save();

            const matchReferralCode = await User.findOne({ myReferralCode: referralCode }).exec();
            if (matchReferralCode) {
                await User.findOneAndUpdate({ phoneNumber: matchReferralCode.phoneNumber }, { $inc: { predictions: 5 } }, { new: true });
            }
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

const OTPLessLogin = asyncHandler(async (req, res) => {
    const { token } = req.body;

    try {
        // let uniqueCode = true;
        // let myReferralCode = '';
        // while (uniqueCode) {
        //     myReferralCode = generateCode();
        //     uniqueCode = await User.findOne({ myReferralCode }).exec();
        // }

        const clientId = "XSES9QEEJ2U72AL51IPKMA127G1DEIE7"; // Replace with your client ID
        const clientSecret = "v3ffvb8uy06cmoyb0c3m2naps0rjmzsf"; // Replace with your client secret

        const userDetails = await UserDetail.verifyToken(
            token,
            clientId,
            clientSecret
        )
        const { national_phone_number: phoneNumber, email, name } = userDetails;
        return res.status(408).json({ phoneNumber: phoneNumber, email: email });
        // const filter = {
        //     $or: [{ phoneNumber: phoneNumber }, { email: email }]
        // };
        // console.log(filter);
        // const user = await User.findOne(filter).exec();

        // if (user) {
        // } else {
        //     const newUser = new User({
        //         phoneNumber,
        //         name,
        //         email,
        //         myReferralCode
        //     });
        //     await newUser.save();

        //     return res.status(201).json({
        //         data: {
        //             phoneNumber: newUser.phoneNumber,
        //             token: generateToken(newUser),
        //         },
        //         message: "User created successfully",
        //     })
        // }
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { phoneNumber, password } = req.body;

    try {
        const foundUser = await User.findOne({ phoneNumber });
        if (foundUser) {
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
        }
        else {
            res.status(201).json({
                message: "User not found !!!",
            });
        }
    } catch (error) {
        res.status(409).json({ message: error.message, cool: "cool" });
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

const getUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
})

const resetPassword = asyncHandler(async (req, res) => {
    const { phoneNumber, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate({ phoneNumber }, { password: hash }).then((foundUser) => {
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        else {
            res.status(201).json({ message: "Password updated successfully" });
        }
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

const setUserDetails = asyncHandler(async (req, res) => {
    const user = req.userData.user;

    const { name, email, phoneNumber, notificationsEnabled } = req.body;

    await User.findOneAndUpdate({ phoneNumber: user }, { $set: { name, email, phoneNumber, notificationsEnabled } }, { new: true }).then((foundUser) => {
        res.status(201).json(foundUser);
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });
})

const getPredictions = asyncHandler(async (req, res) => {
    const user = req.userData.user;

    await User.findOne({ phoneNumber: user }).then((foundUser) => {
        res.status(201).json({ predictions: foundUser.predictions, tempPredictions: foundUser.tempPredictions, addedPredictions: foundUser.addedPredictions, editedPredictions: foundUser.editedPredictions, adsViewed: foundUser.adsViewed });
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });
})
const setPredictions = asyncHandler(async (req, res) => {
    const user = req.userData.user;
    const { predictions, tempPredictions, addedPredictions, editedPredictions, adsViewed } = req.body;
    await User.findOneAndUpdate({ phoneNumber: user }, { $inc: { predictions: predictions, tempPredictions: tempPredictions, addedPredictions: addedPredictions, editedPredictions: editedPredictions, adsViewed: adsViewed } },
        { new: true }).then((foundUser) => {
            res.status(201).json({ predictions: foundUser.predictions, tempPredictions: foundUser.tempPredictions, addedPredictions: foundUser.addedPredictions, editedPredictions: foundUser.editedPredictions, adsViewed: foundUser.adsViewed });
        }).catch((err) => {
            res.status(400).json({ message: err.message });
        });
})

const setReset = asyncHandler(async (req, res) => {
    const user = req.userData.user;

    const { reset } = req.body;

    await User.findOneAndUpdate({ phoneNumber: user }, { $set: { reset: reset } }, { new: true }).then((foundUser) => {
        res.status(201).json({ reset: foundUser.reset });
    }).catch((err) => {
        res.status(400).json({ message: err.message });
    });
})

const getReset = asyncHandler(async (req, res) => {
    const user = req.userData.user;

    await User.findOne({ phoneNumber: user }).then((foundUser) => {
        res.status(201).json({ reset: foundUser.reset });
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

module.exports = { OTPLessLogin, registerUser, loginUser, verifyUser, userSettings, getUserDetails, setUserDetails, getUsers, getPredictions, setPredictions, setReset, getReset, resetPassword, resendOtp, verifyOtp, sendOtp };