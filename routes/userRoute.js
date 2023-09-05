const express = require("express");
const { verifyUser, loginUser, registerUser, userSettings } = require("../controllers/userControllers.js");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", verifyUser, (req, res) => { res.send(req.userData) });
router.post("/settings", verifyUser, userSettings);
// router.get("/checktime", checkTime, (req, res) => { });

module.exports = router;