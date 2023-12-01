const express = require("express");
const { verifyUser, loginUser, registerUser, userSettings, getUserDetails, setUserDetails, resetPassword, resendOtp, verifyOtp, sendOtp, getUsers, setPredictions, getPredictions, setReset, getReset } = require("../controllers/userControllers.js");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", verifyUser, (req, res) => { res.send(req.userData) });
router.post("/settings", verifyUser, userSettings);

router.get("/user_details", verifyUser, getUserDetails);
router.post("/user_details", verifyUser, setUserDetails);

router.post("/send_otp", sendOtp);
router.get("/verify_otp", verifyOtp);
router.get("resend_otp", resendOtp);

router.post("/reset_password", resetPassword);
router.get("/users", getUsers);

router.post("/predictions", verifyUser, setPredictions);
router.get("/predictions", verifyUser, getPredictions);

router.get("/reset", verifyUser, getReset);
router.post("/reset", verifyUser, setReset);

module.exports = router;