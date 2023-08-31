const express = require("express");
const { verifyAdmin, loginAdmin, getAllUsers} = require("../controllers/adminControllers.js");
const router = express.Router();

router.post("/login", loginAdmin);
router.get("/verify", verifyAdmin, (req, res) => { res.send(req.adminData) });
router.get("/users", getAllUsers);


module.exports = router;