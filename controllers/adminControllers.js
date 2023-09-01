const asyncHandler = require("express-async-handler");
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const _ = require("underscore");
const User = require("../models/user.js");
const Transaction = require("../models/transaction.js");

function generateToken(user) {
    return jwt.sign({ user: user.email }, "shhh secret")
}

const loginAdmin = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (email == "admin.tring@gmail.com" && password == "admin-tring") {
        const token = generateToken(email);
        res.status(200).json({
            data: {
                email,
                token,
            },
            message: "Login successful",
        });
    } else {
        res.status(400);
        throw new Error("Invalid email or password");
    }
});


const verifyAdmin = asyncHandler(async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "shhh secret");
        req.adminData = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized Access",
        })
    }
});

function formatDateToDDMMYYYY(timestamp) {
    const date = new Date(timestamp);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
}

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        const transactions = await Transaction.find();

        const formattedUsers = formatUsersList(users, transactions);
        res.status(200).json(formattedUsers);

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

const formatUsersList = (users, transactions) => {
    const formattedUsers = [];
    users.forEach(user => {
        const { _id, name, phoneNumber, region, language, createdAt } = user;
        var userTransactions = [];
        transactions.forEach((transaction) => {
            if (transaction.user_id.equals(user._id)) {
                // console.log("in if");
                // console.log(user._id);
                // console.log(transaction.user_id);
                userTransactions.push(formatDateToDDMMYYYY(transaction.transaction_date));
            }
            // else {
            //     console.log("in else");
            //     console.log(user._id);
            //     console.log(transaction.user_id);
            // }
        })
        const uniqueDays = _.uniq(userTransactions);

        userTransactions = uniqueDays.length;
        const lastPrediction = uniqueDays[userTransactions - 1];

        formattedUsers.push({
            _id,
            name,
            phoneNumber,
            region,
            language,
            createdAt,
            userTransactions,
            lastPrediction,
        });
    });
    return formattedUsers;
};


module.exports = { loginAdmin, verifyAdmin, getAllUsers };