const express = require("express");
const { verifyUser, loginUser, registerUser } = require("../controllers/userControllers.js");
const router = express.Router();

router.get("/verify", verifyUser);
router.post("/login", loginUser);
router.post("/register", registerUser);

module.exports = router;