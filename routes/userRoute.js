const express = require("express");
const { verifyUser, loginUser, registerUser, userSettings, getUserDetails, setUserDetails, resetPassword, resendOtp, verifyOtp, sendOtp, getUsers, setPredictions, getPredictions, setReset, getReset, OTPLessLogin, createUser } = require("../controllers/userControllers.js");
const router = express.Router();

router.post("/otpless_login", OTPLessLogin);
router.post("/create_user", createUser);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", verifyUser, (req, res) => { res.send(req.userData) });
// router.get("/verify", (req, res) => { res.send(req.userData) });
router.post("/settings", verifyUser, userSettings);
// router.post("/settings", userSettings);

router.get("/user_details", verifyUser, getUserDetails);
// router.get("/user_details", getUserDetails);
router.post("/user_details", verifyUser, setUserDetails);
// router.post("/user_details", setUserDetails);

router.post("/send_otp", sendOtp);
router.get("/verify_otp", verifyOtp);
router.get("resend_otp", resendOtp);

router.post("/reset_password", resetPassword);
router.get("/users", getUsers);

router.post("/predictions", verifyUser, setPredictions);
// router.post("/predictions", setPredictions);
router.get("/predictions", verifyUser, getPredictions);
// router.get("/predictions", getPredictions);

router.get("/reset", verifyUser, getReset);
router.post("/reset", verifyUser, setReset);
// router.get("/reset", getReset);
// router.post("/reset", setReset);

module.exports = router;