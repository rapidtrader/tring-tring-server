const express = require("express");
const { VerifyAdmin, loginAdmin } = require("../controllers/adminControllers.js");
const router = express.Router();

router.get("/verify", VerifyAdmin);
router.post("/login", loginAdmin);

module.exports = router;