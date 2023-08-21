const express = require("express");
const { verifyUser, loginUser, registerUser } = require("../controllers/userControllers.js");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", verifyUser, (req, res) => {res.send(req.userData)});

module.exports = router;