const express = require("express");
const { verifyAdmin, loginAdmin } = require("../controllers/adminControllers.js");
const router = express.Router();

router.post("/login", loginAdmin);
router.get("/verify", verifyAdmin, (req, res) => {res.send(req.adminData)});
// router.get("/users", VerifyAdmin, getAllUsers);


module.exports = router;