const asyncHandler = require("express-async-handler");
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");

function generateToken(user) {
    return jwt.sign({ user: user.email }, "shhh secret", {
        expiresIn: "60min",
    });
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


const verifyAdmin = asyncHandler(async (req, res,next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "shhh secret");
        req.adminData = decoded;
        next();
    }catch(error){
        res.status(401).json({
            message: "Unauthorized Access",
        })
    }
});

module.exports = { loginAdmin, verifyAdmin };