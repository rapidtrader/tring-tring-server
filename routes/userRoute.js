const express = require("express");
const { verifyUser, loginUser, registerUser, userSettings, getEditCount, updateEditCount } = require("../controllers/userControllers.js");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", verifyUser, (req, res) => { res.send(req.userData) });
router.post("/settings", verifyUser, userSettings);

router.get("/edit_count", verifyUser, getEditCount);
router.post("/edit_count", verifyUser, updateEditCount);

module.exports = router;