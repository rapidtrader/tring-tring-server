const asyncHandler = require("express-async-handler");
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (email == "admin.tring@gmail.com" && password == "admin-tring") {
        const token = generateToken(email);
        res.status(200).json({
            email,
            token,
        });
    } else {
        res.status(400);
        throw new Error("Invalid email or password");
    }
});

function generateToken(email) {
    return jwt.sign({ email }, "shhh secret", {
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

const VerifyAdmin = asyncHandler(async (req, res) => {
    verifyToken(req) ? res.status(200).json({}) : res.status(401).json({});

});

module.exports = { loginAdmin, VerifyAdmin };