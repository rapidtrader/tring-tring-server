const express = require("express");
const { verifyUser, loginUser, registerUser, userSettings, getEditCount, updateEditCount, decrementEditCount, getUserDetails, resetPassword, resendOtp, verifyOtp, sendOtp, getUsers } = require("../controllers/userControllers.js");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", verifyUser, (req, res) => { res.send(req.userData) });
router.post("/settings", verifyUser, userSettings);

router.get("/user_details", verifyUser, getUserDetails);

router.post("/send_otp", sendOtp);
router.get("/verify_otp", verifyOtp);
router.get("resend_otp", resendOtp);

router.get("/reset_password", resetPassword);
router.get("/users", getUsers);

router.get("/edit_count", verifyUser, getEditCount);
router.post("/edit_count", verifyUser, decrementEditCount);
router.post("/update_edit_count", verifyUser, updateEditCount);

module.exports = router;