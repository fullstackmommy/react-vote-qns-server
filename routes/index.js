const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const {User} = require("../models")
const secret = "SUPER SECRET"

router
    .route("/")
    .get((req, res) => {
        res.sendStatus(200);
    });

module.exports = router;
