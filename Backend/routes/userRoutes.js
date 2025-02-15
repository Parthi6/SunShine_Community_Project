const express = require("express");
const { register } = require("../controllers/userController");

const router = express.Router();

router.route("/parent/register").post(register);

module.exports = router; 