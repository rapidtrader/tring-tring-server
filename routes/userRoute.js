const express = require("express");
const { verifyUser, loginUser, registerUser, userSettings, getUserDetails, resetPassword, resendOtp, verifyOtp, sendOtp, getUsers, setPredictions, getPredictions } = require("../controllers/userControllers.js");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", verifyUser, (req, res) => { res.send(req.userData) });
router.post("/settings", verifyUser, userSettings);

router.get("/user_details", verifyUser, getUserDetails);

router.post("/send_otp", sendOtp);
router.get("/verify_otp", verifyOtp);
router.get("resend_otp", resendOtp);

router.post("/reset_password", resetPassword);
router.get("/users", getUsers);

router.post("/predictions", verifyUser, setPredictions);
router.get("/predictions", verifyUser, getPredictions);

module.exports = router;